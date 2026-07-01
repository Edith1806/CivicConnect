package com.example.civicconnect.service;

import com.example.civicconnect.entity.Citizen;
import com.example.civicconnect.repository.CitizenRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.example.civicconnect.dto.RegisterRequest;
import java.util.List;
import com.example.civicconnect.exception.EmailAlreadyExistsException;

@Service
public class CitizenService {

    private final CitizenRepository citizenRepository;
    private final PasswordEncoder passwordEncoder;

    // ✅ Constructor Injection (BEST PRACTICE)
    public CitizenService(CitizenRepository citizenRepository,
                          PasswordEncoder passwordEncoder) {
        this.citizenRepository = citizenRepository;
        this.passwordEncoder = passwordEncoder;
    }
    public Citizen register(RegisterRequest request) {

    Citizen citizen = Citizen.builder()
            .name(request.getName())
            .email(request.getEmail())
            .password(request.getPassword()) // encoded later
            .phone(request.getPhone())
            .address(request.getAddress())
            .role("ROLE_USER")
            .active(false) // ❗ inactive until email verification
            .build();

    return registerCitizen(citizen);
}
    // =========================
    // Register new citizen
    // =========================
    public Citizen registerCitizen(Citizen citizen) {

        // 🔴 HARD VALIDATIONS (enterprise-grade)
        if (citizen.getEmail() == null || citizen.getEmail().isBlank()) {
            throw new IllegalArgumentException("Email cannot be null or empty");
        }

        if (citizen.getPassword() == null || citizen.getPassword().isBlank()) {
            throw new IllegalArgumentException("Password cannot be null or empty");
        }

        if (citizenRepository.existsByEmail(citizen.getEmail())) {
            throw new EmailAlreadyExistsException("Email already registered");

        }

        // 🔐 Encode password BEFORE saving
        citizen.setPassword(
                passwordEncoder.encode(citizen.getPassword())
        );

        // 🔐 Default role
        if (citizen.getRole() == null) {
            citizen.setRole("ROLE_USER");
        }

        // 🔐 Default active
        if (citizen.getActive() == null) {
            citizen.setActive(true);
        }

        return citizenRepository.save(citizen);
    }

    // =========================
    // Get all citizens
    // =========================
    public List<Citizen> getAllCitizens() {
        return citizenRepository.findAll();
    }

    // =========================
    // Get citizen by ID
    // =========================
    public Citizen getCitizenById(Long id) {
        return citizenRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Citizen not found"));
    }
    public Citizen findByEmail(String email) {
        return citizenRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Citizen not found with email: " + email)
                );
    }

    public Citizen updateCitizen(Citizen citizen) {
        return citizenRepository.save(citizen);
    }

}
