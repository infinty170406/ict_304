package com.example.demo.dto;

import java.math.BigDecimal;

public record TransactionRequest(
        Long accountId,
        BigDecimal amount,
        String description
) {}
