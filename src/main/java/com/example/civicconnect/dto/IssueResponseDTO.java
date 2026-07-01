package com.example.civicconnect.dto;

import java.time.LocalDateTime;
import java.util.List;

public record IssueResponseDTO(
        Long id,
        String category,
        String description,
        String location,
        Double latitude,
        Double longitude,
        String priority,
        String status,
        List<String> imageUrls,
        boolean StatusViewed,
        String citizenName,
        String citizenEmail,
        String adminRemark,
        LocalDateTime createdAt,
        Integer upvoteCount,
        Boolean upvotedByCurrentUser
) {}
