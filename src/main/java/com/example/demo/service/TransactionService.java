package com.example.demo.service;

import com.example.demo.Entity.Transaction;
import com.example.demo.dto.TransactionResponse;
import com.example.demo.repository.TransactionRepo;
import com.example.demo.service.Iservice.ITransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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

    private TransactionResponse mapToResponse(Transaction transaction) {
        return new TransactionResponse(
                transaction.getId(),
                transaction.getType(),
                transaction.getAmount(),
                transaction.getSourceAccount() != null ? transaction.getSourceAccount().getId() : null,
                transaction.getDestinationAccount() != null ? transaction.getDestinationAccount().getId() : null,
                transaction.getTimestamp(),
                transaction.getDescription()
        );
    }
}
