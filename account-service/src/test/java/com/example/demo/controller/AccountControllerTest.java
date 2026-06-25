package com.example.demo.controller;

import com.example.demo.Entity.Account;
import com.example.demo.dto.CreateAccountRequest;
import com.example.demo.dto.TransactionRequest;
import com.example.demo.dto.TransferRequest;
import com.example.demo.exception.ForbiddenException;
import com.example.demo.exception.NotfoundException;
import com.example.demo.exception.UnauthorizeException;
import com.example.demo.service.Iservice.IAccountService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AccountController.class)
class AccountControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private IAccountService accountService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testCreateAccount() throws Exception {
        CreateAccountRequest request = new CreateAccountRequest("Jean", "XAF", new BigDecimal("5000"));
        Account account = new Account("Jean", "XAF", new BigDecimal("5000"));
        account.setId(1L);

        when(accountService.createAccount(any(CreateAccountRequest.class))).thenReturn(account);

        mockMvc.perform(post("/api/accounts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.name").value("Jean"))
                .andExpect(jsonPath("$.solde").value(5000));
    }

    @Test
    void testGetAllAccounts() throws Exception {
        Account account1 = new Account("Jean", "XAF", new BigDecimal("5000"));
        account1.setId(1L);
        Account account2 = new Account("Paul", "XAF", new BigDecimal("3000"));
        account2.setId(2L);

        when(accountService.getAllAccounts()).thenReturn(List.of(account1, account2));

        mockMvc.perform(get("/api/accounts"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[1].id").value(2L));
    }

    @Test
    void testGetAccountById_Success() throws Exception {
        Account account = new Account("Jean", "XAF", new BigDecimal("5000"));
        account.setId(1L);

        when(accountService.getAccountById(1L)).thenReturn(account);

        mockMvc.perform(get("/api/accounts/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.name").value("Jean"));
    }

    @Test
    void testDeposit_Success() throws Exception {
        TransactionRequest request = new TransactionRequest(1L, new BigDecimal("2000"), "Salaire");

        doNothing().when(accountService).deposit(any(TransactionRequest.class));

        mockMvc.perform(post("/api/accounts/deposit")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().string("Dépôt réussi"));
    }

    @Test
    void testWithdraw_Success() throws Exception {
        TransactionRequest request = new TransactionRequest(1L, new BigDecimal("1000"), "Courses");

        doNothing().when(accountService).withdraw(any(TransactionRequest.class));

        mockMvc.perform(post("/api/accounts/withdraw")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().string("Retrait réussi"));
    }

    @Test
    void testTransfer_Success() throws Exception {
        TransferRequest request = new TransferRequest(1L, 2L, new BigDecimal("1500"), "Cadeau");

        doNothing().when(accountService).transfer(any(TransferRequest.class));

        mockMvc.perform(post("/api/accounts/transfer")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().string("Virement réussi"));
    }

    // --- GlobalExceptionHandler Tests ---

    @Test
    void testHandleNotFound() throws Exception {
        when(accountService.getAccountById(99L)).thenThrow(new NotfoundException("Compte introuvable"));

        mockMvc.perform(get("/api/accounts/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").value("Not Found"))
                .andExpect(jsonPath("$.message").value("Compte introuvable"));
    }

    @Test
    void testHandleForbidden() throws Exception {
        when(accountService.getAccountById(1L)).thenThrow(new ForbiddenException("Accès interdit"));

        mockMvc.perform(get("/api/accounts/1"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.error").value("Forbidden"))
                .andExpect(jsonPath("$.message").value("Accès interdit"));
    }

    @Test
    void testHandleUnauthorized() throws Exception {
        when(accountService.getAccountById(1L)).thenThrow(new UnauthorizeException("Non autorisé"));

        mockMvc.perform(get("/api/accounts/1"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Unauthorized"))
                .andExpect(jsonPath("$.message").value("Non autorisé"));
    }

    @Test
    void testHandleIllegalArgument() throws Exception {
        TransactionRequest request = new TransactionRequest(1L, new BigDecimal("10000"), "Courses");
        doThrow(new IllegalArgumentException("Solde insuffisant")).when(accountService).withdraw(any(TransactionRequest.class));

        mockMvc.perform(post("/api/accounts/withdraw")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Bad Request"))
                .andExpect(jsonPath("$.message").value("Solde insuffisant"));
    }

    @Test
    void testHandleGeneralException() throws Exception {
        when(accountService.getAllAccounts()).thenThrow(new RuntimeException("Erreur inattendue"));

        mockMvc.perform(get("/api/accounts"))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.error").value("Internal Server Error"))
                .andExpect(jsonPath("$.message").value("Une erreur interne est survenue. Detail: Erreur inattendue"));
    }
}
