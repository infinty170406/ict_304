package com.example.demo.dto;

import java.math.BigDecimal;

public record CreateTransactionRequest(
        String type,
        BigDecimal amount,
        Long sourceAccountId,
        Long destinationAccountId,
        String description
) {}
