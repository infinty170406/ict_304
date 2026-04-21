package com.example.demo.controller;

import com.example.demo.dto.TransactionResponse;
import com.example.demo.service.Iservice.ITransactionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
@Tag(name = "Transaction History", description = "Endpoints pour consulter l'historique des transactions")
public class TransactionController {

    private final ITransactionService transactionService;

    @GetMapping("/account/{accountId}")
    @Operation(summary = "Récupérer l'historique des transactions pour un compte donné", responses = {
        @ApiResponse(responseCode = "200", description = "Historique récupéré avec succès")
    })
    public ResponseEntity<List<TransactionResponse>> getAccountHistory(
            @Parameter(description = "ID du compte à consulter", examples = @ExampleObject(name = "Exemple Compte 1", value = "1"))
            @PathVariable Long accountId) {
        return ResponseEntity.ok(transactionService.getAccountHistory(accountId));
    }
}
