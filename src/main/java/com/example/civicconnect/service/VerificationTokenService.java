package com.example.civicconnect.service;

import com.example.civicconnect.entity.Citizen;
import com.example.civicconnect.entity.VerificationToken;
import com.example.civicconnect.repository.VerificationTokenRepository;
import com.example.civicconnect.repository.CitizenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class VerificationTokenService {

    private final VerificationTokenRepository repo;
    private final CitizenRepository citizenRepo;

    public void createToken(Citizen citizen, String token) {
        repo.save(
            VerificationToken.builder()
                .token(token)
                .citizen(citizen)
                .expiryDate(LocalDateTime.now().plusHours(24))
                .build()
        );
    }

    public void verifyToken(String token) {
        VerificationToken vt = repo.findByToken(token)
            .orElseThrow(() -> new RuntimeException("Invalid token"));

        if (vt.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token expired");
        }

        Citizen citizen = vt.getCitizen();
        citizen.setActive(true);
        citizenRepo.save(citizen);

        repo.delete(vt);
    }
}
