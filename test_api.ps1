$ErrorActionPreference = 'Stop'

Write-Host "TC-01: Creation compte 1"
$res1 = Invoke-RestMethod -Uri "http://localhost:3000/api/accounts" -Method Post -Body '{"name": "Jean Dupont", "currency": "XAF", "soldeInitial": 5000}' -ContentType "application/json"
$res1 | ConvertTo-Json

Write-Host "Creation compte 2"
$res2 = Invoke-RestMethod -Uri "http://localhost:3000/api/accounts" -Method Post -Body '{"name": "Marie Curie", "currency": "XAF", "soldeInitial": 1000}' -ContentType "application/json"
$res2 | ConvertTo-Json

Write-Host "TC-02: Depot 2000 sur compte 1"
$res3 = Invoke-RestMethod -Uri "http://localhost:3000/api/accounts/deposit" -Method Post -Body '{"accountId": 1, "amount": 2000, "description": "Salaire"}' -ContentType "application/json"
$res3

Write-Host "TC-03: Retrait 1000 sur compte 1"
$res4 = Invoke-RestMethod -Uri "http://localhost:3000/api/accounts/withdraw" -Method Post -Body '{"accountId": 1, "amount": 1000, "description": "Courses"}' -ContentType "application/json"
$res4

Write-Host "TC-04: Retrait 10000 sur compte 1 (Solde insuffisant)"
try {
    $res5 = Invoke-RestMethod -Uri "http://localhost:3000/api/accounts/withdraw" -Method Post -Body '{"accountId": 1, "amount": 10000, "description": "Achat Luxe"}' -ContentType "application/json"
    $res5
} catch {
    Write-Host "Erreur capturee: $($_.Exception.Message)"
    if ($_.ErrorDetails) { Write-Host $_.ErrorDetails.Message }
}

Write-Host "TC-05: Virement 1500 compte 1 vers 2"
$res6 = Invoke-RestMethod -Uri "http://localhost:3000/api/accounts/transfer" -Method Post -Body '{"sourceAccountId": 1, "destinationAccountId": 2, "amount": 1500, "description": "Cadeau"}' -ContentType "application/json"
$res6

Write-Host "Verification: Historique compte 1"
$res7 = Invoke-RestMethod -Uri "http://localhost:3000/api/transactions/account/1" -Method Get
$res7 | ConvertTo-Json -Depth 3

Write-Host "Verification: Compte 1 final"
$res8 = Invoke-RestMethod -Uri "http://localhost:3000/api/accounts/1" -Method Get
$res8 | ConvertTo-Json

Write-Host "Verification: Compte 2 final"
$res9 = Invoke-RestMethod -Uri "http://localhost:3000/api/accounts/2" -Method Get
$res9 | ConvertTo-Json
