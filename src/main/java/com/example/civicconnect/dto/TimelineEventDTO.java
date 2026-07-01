package com.example.civicconnect.dto;

import java.time.LocalDateTime;

public record TimelineEventDTO(
        Long id,
        String eventType,
        String description,
        String performedBy,
        LocalDateTime timestamp
) {}
