package com.example.civicconnect.controller;

import com.example.civicconnect.dto.LoginRequest;
import com.example.civicconnect.dto.AuthResponse;
import com.example.civicconnect.entity.Citizen;
import com.example.civicconnect.entity.RefreshToken;
import com.example.civicconnect.security.JwtUtil;
import com.example.civicconnect.service.CitizenService;
import com.example.civicconnect.service.RefreshTokenService;
import com.example.civicconnect.service.VerificationTokenService;
import com.example.civicconnect.repository.RefreshTokenRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final CitizenService citizenService;
    private final RefreshTokenService refreshTokenService;
    private final VerificationTokenService verificationTokenService;
    private final RefreshTokenRepository refreshTokenRepository;
    private final UserDetailsService userDetailsService;

    public AuthController(
            AuthenticationManager authenticationManager,
            JwtUtil jwtUtil,
            CitizenService citizenService,
            RefreshTokenService refreshTokenService,
            RefreshTokenRepository refreshTokenRepository,
            UserDetailsService userDetailsService,
            VerificationTokenService verificationTokenService
    ) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.citizenService = citizenService;
        this.refreshTokenService = refreshTokenService;
        this.verificationTokenService = verificationTokenService;
        this.refreshTokenRepository = refreshTokenRepository;
        this.userDetailsService = userDetailsService;
    }

    // =========================
    // LOGIN
    // =========================
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {

        Authentication authentication =
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                request.getEmail(),
                                request.getPassword()
                        )
                );

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        Citizen citizen = citizenService.findByEmail(request.getEmail());

        String accessToken = jwtUtil.generateToken(userDetails);
        String refreshToken =
                refreshTokenService.createRefreshToken(citizen).getToken();

        return ResponseEntity.ok(
                new AuthResponse(accessToken, refreshToken)
        );
    }
    @GetMapping("/verify")
public ResponseEntity<String> verifyEmail(@RequestParam String token) {
    verificationTokenService.verifyToken(token);
    return ResponseEntity.ok("Email verified successfully. You can now login.");
}

    // =========================
    // REFRESH TOKEN
    // =========================
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@RequestParam String refreshToken) {

        RefreshToken token = refreshTokenService.verifyExpiration(
                refreshTokenRepository.findByToken(refreshToken)
                        .orElseThrow(() -> new RuntimeException("Invalid refresh token"))
        );

        Citizen citizen = token.getCitizen();
        UserDetails userDetails =
                userDetailsService.loadUserByUsername(citizen.getEmail());

        String newAccessToken = jwtUtil.generateToken(userDetails);

        return ResponseEntity.ok(
                new AuthResponse(newAccessToken, token.getToken())
        );
    }

    // =========================
    // LOGOUT
    // =========================
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestParam String refreshToken) {
        refreshTokenService.deleteByToken(refreshToken);
        return ResponseEntity.ok("Logged out successfully");
    }
}
