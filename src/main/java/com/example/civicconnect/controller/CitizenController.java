package com.example.civicconnect.controller;

import com.example.civicconnect.dto.RegisterRequest;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import com.example.civicconnect.entity.Citizen;
import com.example.civicconnect.service.CitizenService;
import com.example.civicconnect.service.VerificationTokenService;
import com.example.civicconnect.service.EmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;
import java.util.UUID;


import java.util.List;
@RestController
@RequestMapping("/api/citizens")
public class CitizenController {

    private final CitizenService citizenService;
    private final VerificationTokenService verificationTokenService;
    private final EmailService emailService;

    public CitizenController(
            CitizenService citizenService,
            VerificationTokenService verificationTokenService,
            EmailService emailService
    ) {
        this.citizenService = citizenService;
        this.verificationTokenService = verificationTokenService;
        this.emailService = emailService;
    }

    // =========================
    // REGISTER (WITH VERIFICATION)
    // =========================
    @PostMapping("/register")
    public ResponseEntity<String> registerCitizen(
            @RequestBody RegisterRequest request
    ) {
        System.out.println("🔥 REGISTER HIT: " + request.getEmail());
        Citizen citizen = Citizen.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(request.getPassword())
                .phone(request.getPhone())
                .address(request.getAddress())
                .role("ROLE_USER")
                .active(false) // 🔒 until verified
                .build();

        Citizen savedCitizen = citizenService.registerCitizen(citizen);

        String token = UUID.randomUUID().toString();
        verificationTokenService.createToken(savedCitizen, token);

        String verifyLink =
                "http://localhost:5173/verify-callback?token=" + token;

        emailService.send(
                savedCitizen.getEmail(),
                "Verify your CivicConnect account",
                "Click the link below to verify your account:\n\n" + verifyLink
        );

        return ResponseEntity.ok(
                "Registration successful. Please verify your email."
        );
    }

    // =========================
    // ADMIN / INTERNAL APIs
    // =========================
@PreAuthorize("hasRole('ADMIN')")
@GetMapping
public ResponseEntity<List<Citizen>> getAllCitizens() {
    return ResponseEntity.ok(citizenService.getAllCitizens());
}


    @GetMapping("/{id}")
    public ResponseEntity<Citizen> getCitizenById(@PathVariable Long id) {
        return ResponseEntity.ok(citizenService.getCitizenById(id));
    }

@PreAuthorize("hasAnyRole('USER', 'ADMIN')")
@GetMapping("/me")
public ResponseEntity<Citizen> getCurrentUser(Authentication authentication) {
    Citizen citizen = citizenService.findByEmail(authentication.getName());
    return ResponseEntity.ok(citizen);
}

@PreAuthorize("hasAnyRole('USER', 'ADMIN')")
@PutMapping("/me")
public ResponseEntity<Citizen> updateCurrentUser(
        @RequestBody RegisterRequest request,
        Authentication authentication
) {
    Citizen citizen = citizenService.findByEmail(authentication.getName());
    if (request.getName() != null && !request.getName().isBlank()) {
        citizen.setName(request.getName());
    }
    if (request.getPhone() != null && !request.getPhone().isBlank()) {
        citizen.setPhone(request.getPhone());
    }
    if (request.getAddress() != null && !request.getAddress().isBlank()) {
        citizen.setAddress(request.getAddress());
    }
    return ResponseEntity.ok(citizenService.updateCitizen(citizen));
}

}
