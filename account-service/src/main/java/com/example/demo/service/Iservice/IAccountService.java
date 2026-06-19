package com.example.demo.service.Iservice;

import com.example.demo.Entity.Account;
import com.example.demo.dto.CreateAccountRequest;
import com.example.demo.dto.TransactionRequest;
import com.example.demo.dto.TransferRequest;

import java.util.List;

public interface IAccountService {
    Account createAccount(CreateAccountRequest request);
    List<Account> getAllAccounts();
    Account getAccountById(Long id);
    void deposit(TransactionRequest request);
    void withdraw(TransactionRequest request);
    void transfer(TransferRequest request);
}
