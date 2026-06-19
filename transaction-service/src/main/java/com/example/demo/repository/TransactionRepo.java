package com.example.demo.repository;

import com.example.demo.Entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepo extends JpaRepository<Transaction, Long> {
    List<Transaction> findBySourceAccountIdOrDestinationAccountIdOrderByTimestampDesc(Long sourceId, Long destId);
}
