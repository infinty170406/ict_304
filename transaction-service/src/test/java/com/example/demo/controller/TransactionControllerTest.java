package com.example.demo.controller;

import com.example.demo.Entity.TransactionType;
import com.example.demo.dto.CreateTransactionRequest;
import com.example.demo.dto.TransactionResponse;
import com.example.demo.exception.ForbiddenException;
import com.example.demo.exception.NotfoundException;
import com.example.demo.exception.UnauthorizeException;
import com.example.demo.service.Iservice.ITransactionService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TransactionController.class)
class TransactionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ITransactionService transactionService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testGetAccountHistory() throws Exception {
        TransactionResponse response = new TransactionResponse(
                1L,
                TransactionType.DEPOSIT,
                new BigDecimal("500.00"),
                null,
                1L,
                LocalDateTime.now(),
                "Deposit test"
        );

        when(transactionService.getAccountHistory(1L)).thenReturn(List.of(response));

        mockMvc.perform(get("/api/transactions/account/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].amount").value(500.00))
                .andExpect(jsonPath("$[0].description").value("Deposit test"));
    }

    @Test
    void testCreateTransaction() throws Exception {
        CreateTransactionRequest request = new CreateTransactionRequest(
                TransactionType.DEPOSIT,
                new BigDecimal("500.00"),
                null,
                1L,
                "Deposit test"
        );

        doNothing().when(transactionService).createTransaction(any(CreateTransactionRequest.class));

        mockMvc.perform(post("/api/transactions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());
    }

    // --- GlobalExceptionHandler Tests for transaction-service ---

    @Test
    void testHandleNotFound() throws Exception {
        when(transactionService.getAccountHistory(99L)).thenThrow(new NotfoundException("Transaction introuvable"));

        mockMvc.perform(get("/api/transactions/account/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").value("Not Found"))
                .andExpect(jsonPath("$.message").value("Transaction introuvable"));
    }

    @Test
    void testHandleForbidden() throws Exception {
        when(transactionService.getAccountHistory(1L)).thenThrow(new ForbiddenException("Accès interdit"));

        mockMvc.perform(get("/api/transactions/account/1"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.error").value("Forbidden"))
                .andExpect(jsonPath("$.message").value("Accès interdit"));
    }

    @Test
    void testHandleUnauthorized() throws Exception {
        when(transactionService.getAccountHistory(1L)).thenThrow(new UnauthorizeException("Non autorisé"));

        mockMvc.perform(get("/api/transactions/account/1"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Unauthorized"))
                .andExpect(jsonPath("$.message").value("Non autorisé"));
    }

    @Test
    void testHandleIllegalArgument() throws Exception {
        CreateTransactionRequest request = new CreateTransactionRequest(
                TransactionType.DEPOSIT,
                new BigDecimal("-500.00"),
                null,
                1L,
                "Invalid deposit"
        );

        doThrow(new IllegalArgumentException("Montant invalide")).when(transactionService).createTransaction(any(CreateTransactionRequest.class));

        mockMvc.perform(post("/api/transactions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Bad Request"))
                .andExpect(jsonPath("$.message").value("Montant invalide"));
    }

    @Test
    void testHandleGeneralException() throws Exception {
        when(transactionService.getAccountHistory(1L)).thenThrow(new RuntimeException("Erreur générale"));

        mockMvc.perform(get("/api/transactions/account/1"))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.error").value("Internal Server Error"))
                .andExpect(jsonPath("$.message").value("Une erreur interne est survenue."));
    }
}
