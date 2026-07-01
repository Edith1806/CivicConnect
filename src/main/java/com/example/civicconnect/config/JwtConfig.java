package com.example.civicconnect.config;

import org.springframework.context.annotation.Configuration;

@Configuration
public class JwtConfig {

    public static final String SECRET_KEY =
            "civicconnect_super_secret_key_123456";

    public static final long EXPIRATION_TIME =
            1000 * 60 * 60 * 24; // 24 hours
}
