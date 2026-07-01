package com.example.civicconnect.repository;

import com.example.civicconnect.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    Optional<RefreshToken> findByToken(String token);

    void deleteByToken(String token);

    void deleteByCitizenId(Long citizenId); // 🔥 ADD THIS
}
