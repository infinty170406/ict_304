package com.example.demo.dto;

import com.example.demo.Entity.TransactionType;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record TransactionResponse(
        Long id,
        TransactionType type,
        BigDecimal amount,
        Long sourceAccountId,
        Long destinationAccountId,
        LocalDateTime timestamp,
        String description
) {}
