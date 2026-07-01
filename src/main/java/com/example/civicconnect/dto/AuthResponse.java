package com.example.civicconnect.dto;

public record AuthResponse(
        String accessToken,
        String refreshToken
) {}
