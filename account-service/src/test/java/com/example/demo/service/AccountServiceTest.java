package com.example.demo.service;

import com.example.demo.Entity.Account;
import org.springframework.web.client.RestTemplate;
import com.example.demo.dto.CreateTransactionRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.math.BigDecimal;
import java.util.Optional;
import com.example.demo.dto.TransactionRequest;
import com.example.demo.dto.TransferRequest;
import com.example.demo.repository.AccountRepo;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AccountServiceTest {

    @Mock
    private AccountRepo accountRepo;

    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private AccountService accountService;

    private Account testAccount;
    private Account destAccount;

    @BeforeEach
    void setUp() {
        testAccount = new Account("Test Account", "XAF", new BigDecimal("1000.00"));
        testAccount.setId(1L);

        destAccount = new Account("Dest Account", "XAF", new BigDecimal("500.00"));
        destAccount.setId(2L);
    }

    @Test
    void testDeposit() {
        TransactionRequest request = new TransactionRequest(1L, new BigDecimal("500.00"), "Deposit test");
        when(accountRepo.findById(1L)).thenReturn(Optional.of(testAccount));

        accountService.deposit(request);

        assertEquals(new BigDecimal("1500.00"), testAccount.getSolde());
        verify(accountRepo, times(1)).save(testAccount);
        verify(restTemplate, times(1)).postForLocation(anyString(), any(CreateTransactionRequest.class));
    }

    @Test
    void testWithdraw_Success() {
        TransactionRequest request = new TransactionRequest(1L, new BigDecimal("500.00"), "Withdraw test");
        when(accountRepo.findById(1L)).thenReturn(Optional.of(testAccount));

        accountService.withdraw(request);

        assertEquals(new BigDecimal("500.00"), testAccount.getSolde());
        verify(accountRepo, times(1)).save(testAccount);
        verify(restTemplate, times(1)).postForLocation(anyString(), any(CreateTransactionRequest.class));
    }

    @Test
    void testWithdraw_InsufficientFunds() {
        TransactionRequest request = new TransactionRequest(1L, new BigDecimal("1500.00"), "Withdraw test");
        when(accountRepo.findById(1L)).thenReturn(Optional.of(testAccount));

        assertThrows(IllegalArgumentException.class, () -> accountService.withdraw(request));
        verify(accountRepo, never()).save(any());
    }

    @Test
    void testTransfer_Success() {
        TransferRequest request = new TransferRequest(1L, 2L, new BigDecimal("300.00"), "Transfer test");
        when(accountRepo.findById(1L)).thenReturn(Optional.of(testAccount));
        when(accountRepo.findById(2L)).thenReturn(Optional.of(destAccount));

        accountService.transfer(request);

        assertEquals(new BigDecimal("700.00"), testAccount.getSolde());
        assertEquals(new BigDecimal("800.00"), destAccount.getSolde());
        verify(accountRepo, times(1)).save(testAccount);
        verify(accountRepo, times(1)).save(destAccount);
        verify(restTemplate, times(1)).postForLocation(anyString(), any(CreateTransactionRequest.class));
    }
}
