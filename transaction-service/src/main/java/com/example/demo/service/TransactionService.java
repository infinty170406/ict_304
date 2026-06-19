package com.example.demo.service;

import com.example.demo.Entity.Transaction;
import com.example.demo.dto.TransactionResponse;
import com.example.demo.repository.TransactionRepo;
import com.example.demo.service.Iservice.ITransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.example.demo.dto.CreateTransactionRequest;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionService implements ITransactionService {

    private final TransactionRepo transactionRepo;

    @Override
    public List<TransactionResponse> getAccountHistory(Long accountId) {
        return transactionRepo.findBySourceAccountIdOrDestinationAccountIdOrderByTimestampDesc(accountId, accountId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void createTransaction(CreateTransactionRequest request) {
        Transaction transaction = Transaction.builder()
                .type(request.type())
                .amount(request.amount())
                .sourceAccountId(request.sourceAccountId())
                .destinationAccountId(request.destinationAccountId())
                .description(request.description())
                .build();
        transactionRepo.save(transaction);
    }

    private TransactionResponse mapToResponse(Transaction transaction) {
        return new TransactionResponse(
                transaction.getId(),
                transaction.getType(),
                transaction.getAmount(),
                transaction.getSourceAccountId(),
                transaction.getDestinationAccountId(),
                transaction.getTimestamp(),
                transaction.getDescription()
        );
    }
}
