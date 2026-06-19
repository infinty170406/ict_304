package com.example.demo.dto;

import com.example.demo.Entity.TransactionType;
import java.math.BigDecimal;

public record CreateTransactionRequest(
        TransactionType type,
        BigDecimal amount,
        Long sourceAccountId,
        Long destinationAccountId,
        String description
) {}
