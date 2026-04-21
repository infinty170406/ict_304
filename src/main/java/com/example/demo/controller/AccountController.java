package com.example.demo.controller;

import com.example.demo.Entity.Account;
import com.example.demo.dto.CreateAccountRequest;
import com.example.demo.dto.TransactionRequest;
import com.example.demo.dto.TransferRequest;
import com.example.demo.service.Iservice.IAccountService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
@Tag(name = "Account Management", description = "Endpoints pour la gestion des comptes et les opérations bancaires")
public class AccountController {

    private final IAccountService accountService;

    @PostMapping
    @Operation(summary = "Créer un nouveau compte", responses = {
        @ApiResponse(responseCode = "201", description = "Compte créé avec succès")
    })
    public ResponseEntity<Account> createAccount(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    content = @Content(examples = {
                            @ExampleObject(name = "Création compte Jean", value = "{\"name\": \"Jean Dupont\", \"currency\": \"XAF\", \"soldeInitial\": 5000}")
                    })
            )
            @RequestBody CreateAccountRequest request) {
        return new ResponseEntity<>(accountService.createAccount(request), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Account>> getAllAccounts() {
        return ResponseEntity.ok(accountService.getAllAccounts());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Récupérer un compte par son ID")
    public ResponseEntity<Account> getAccountById(@PathVariable Long id) {
        return ResponseEntity.ok(accountService.getAccountById(id));
    }

    @PostMapping("/deposit")
    @Operation(summary = "Effectuer un dépôt sur un compte", responses = {
        @ApiResponse(responseCode = "200", description = "Dépôt réussi")
    })
    public ResponseEntity<String> deposit(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    content = @Content(examples = {
                            @ExampleObject(name = "Exemple de dépôt", value = "{\"accountId\": 1, \"amount\": 2000, \"description\": \"Salaire\"}")
                    })
            )
            @RequestBody TransactionRequest request) {
        accountService.deposit(request);
        return ResponseEntity.ok("Dépôt réussi");
    }

    @PostMapping("/withdraw")
    @Operation(summary = "Effectuer un retrait depuis un compte", responses = {
        @ApiResponse(responseCode = "200", description = "Retrait réussi"),
        @ApiResponse(responseCode = "400", description = "Solde insuffisant")
    })
    public ResponseEntity<String> withdraw(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    content = @Content(examples = {
                            @ExampleObject(name = "Retrait valide", value = "{\"accountId\": 1, \"amount\": 1000, \"description\": \"Courses\"}"),
                            @ExampleObject(name = "Retrait invalide (Solde insuffisant)", value = "{\"accountId\": 1, \"amount\": 10000, \"description\": \"Achat Luxe\"}")
                    })
            )
            @RequestBody TransactionRequest request) {
        accountService.withdraw(request);
        return ResponseEntity.ok("Retrait réussi");
    }

    @PostMapping("/transfer")
    @Operation(summary = "Effectuer un virement entre deux comptes", responses = {
        @ApiResponse(responseCode = "200", description = "Virement réussi"),
        @ApiResponse(responseCode = "400", description = "Solde insuffisant")
    })
    public ResponseEntity<String> transfer(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    content = @Content(examples = {
                            @ExampleObject(name = "Exemple de virement", value = "{\"sourceAccountId\": 1, \"destinationAccountId\": 2, \"amount\": 1500, \"description\": \"Cadeau\"}")
                    })
            )
            @RequestBody TransferRequest request) {
        accountService.transfer(request);
        return ResponseEntity.ok("Virement réussi");
    }
}
