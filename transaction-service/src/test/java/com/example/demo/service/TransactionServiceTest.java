package com.example.demo.service;

import com.example.demo.Entity.Transaction;
import com.example.demo.Entity.TransactionType;
import com.example.demo.dto.CreateTransactionRequest;
import com.example.demo.dto.TransactionResponse;
import com.example.demo.repository.TransactionRepo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TransactionServiceTest {

    @Mock
    private TransactionRepo transactionRepo;

    @InjectMocks
    private TransactionService transactionService;

    private Transaction testTransaction;

    @BeforeEach
    void setUp() {
        testTransaction = Transaction.builder()
                .id(1L)
                .type(TransactionType.DEPOSIT)
                .amount(new BigDecimal("500.00"))
                .destinationAccountId(1L)
                .description("Test deposit")
                .timestamp(LocalDateTime.now())
                .build();
    }

    @Test
    void testGetAccountHistory() {
        when(transactionRepo.findBySourceAccountIdOrDestinationAccountIdOrderByTimestampDesc(1L, 1L))
                .thenReturn(List.of(testTransaction));

        List<TransactionResponse> history = transactionService.getAccountHistory(1L);

        assertEquals(1, history.size());
        TransactionResponse response = history.get(0);
        assertEquals(1L, response.id());
        assertEquals(TransactionType.DEPOSIT, response.type());
        assertEquals(new BigDecimal("500.00"), response.amount());
        assertNull(response.sourceAccountId());
        assertEquals(1L, response.destinationAccountId());
        assertEquals(testTransaction.getTimestamp(), response.date());
        assertEquals("Test deposit", response.description());
        verify(transactionRepo, times(1)).findBySourceAccountIdOrDestinationAccountIdOrderByTimestampDesc(1L, 1L);
    }

    @Test
    void testCreateTransaction() {
        CreateTransactionRequest request = new CreateTransactionRequest(
                TransactionType.DEPOSIT,
                new BigDecimal("500.00"),
                null,
                1L,
                "Deposit test"
        );

        transactionService.createTransaction(request);

        verify(transactionRepo, times(1)).save(any(Transaction.class));
    }
}
