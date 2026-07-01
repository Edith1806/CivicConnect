package com.example.civicconnect.repository;

import com.example.civicconnect.entity.Citizen;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CitizenRepository extends JpaRepository<Citizen, Long> {

    // find citizen by email
    Optional<Citizen> findByEmail(String email);

    // check if email already exists
    boolean existsByEmail(String email);
}
