package com.example.demo.service.Iservice;

import com.example.demo.dto.TransactionResponse;
import java.util.List;

public interface ITransactionService {
    List<TransactionResponse> getAccountHistory(Long accountId);
    void createTransaction(com.example.demo.dto.CreateTransactionRequest request);
}
