package com.example.demo.service;

import com.example.demo.Entity.Account;
import com.example.demo.Entity.Transaction;
import com.example.demo.Entity.TransactionType;
import com.example.demo.dto.CreateAccountRequest;
import com.example.demo.dto.TransactionRequest;
import com.example.demo.dto.TransferRequest;
import com.example.demo.exception.NotfoundException;
import com.example.demo.repository.AccountRepo;
import com.example.demo.service.Iservice.IAccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import com.example.demo.dto.CreateTransactionRequest;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AccountService implements IAccountService {

    private final AccountRepo accountRepo;
    private final RestTemplate restTemplate;

    @org.springframework.beans.factory.annotation.Value("${transaction.service.url}")
    private String TRANSACTION_SERVICE_URL;

    @Override
    public Account createAccount(CreateAccountRequest request) {
        BigDecimal soldeInitial = request.soldeInitial() != null
                ? request.soldeInitial()
                : BigDecimal.ZERO;

        Account account = new Account(
                request.name(),
                request.currency() != null ? request.currency() : "XAF",
                soldeInitial
        );

        return accountRepo.save(account);
    }

    @Override
    public List<Account> getAllAccounts() {
        return accountRepo.findAll();
    }

    @Override
    public Account getAccountById(Long id) {
        return accountRepo.findById(id)
                .orElseThrow(() -> new NotfoundException("Compte introuvable avec l'id : " + id));
    }

    @Override
    @Transactional
    public void deposit(TransactionRequest request) {
        Account account = getAccountById(request.accountId());
        account.setSolde(account.getSolde().add(request.amount()));
        accountRepo.save(account);

        CreateTransactionRequest txRequest = new CreateTransactionRequest(
                "DEPOSIT",
                request.amount(),
                null,
                account.getId(),
                request.description()
        );
        restTemplate.postForLocation(TRANSACTION_SERVICE_URL, txRequest);
    }

    @Override
    @Transactional
    public void withdraw(TransactionRequest request) {
        Account account = getAccountById(request.accountId());

        if (account.getSolde().compareTo(request.amount()) < 0) {
            throw new IllegalArgumentException("Solde insuffisant pour effectuer le retrait.");
        }

        account.setSolde(account.getSolde().subtract(request.amount()));
        accountRepo.save(account);

        CreateTransactionRequest txRequest = new CreateTransactionRequest(
                "WITHDRAWAL",
                request.amount(),
                account.getId(),
                null,
                request.description()
        );
        restTemplate.postForLocation(TRANSACTION_SERVICE_URL, txRequest);
    }

    @Override
    @Transactional
    public void transfer(TransferRequest request) {
        Account sourceAccount = getAccountById(request.sourceAccountId());
        Account destAccount = getAccountById(request.destinationAccountId());

        if (sourceAccount.getSolde().compareTo(request.amount()) < 0) {
            throw new IllegalArgumentException("Solde insuffisant pour effectuer le virement.");
        }

        // Effectuer le transfert
        sourceAccount.setSolde(sourceAccount.getSolde().subtract(request.amount()));
        destAccount.setSolde(destAccount.getSolde().add(request.amount()));

        accountRepo.save(sourceAccount);
        accountRepo.save(destAccount);

        CreateTransactionRequest txRequest = new CreateTransactionRequest(
                "TRANSFER",
                request.amount(),
                sourceAccount.getId(),
                destAccount.getId(),
                request.description()
        );
        restTemplate.postForLocation(TRANSACTION_SERVICE_URL, txRequest);
    }
}
