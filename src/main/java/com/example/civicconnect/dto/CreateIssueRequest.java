package com.example.civicconnect.dto;

import com.example.civicconnect.entity.IssueCategory;
import com.example.civicconnect.entity.IssuePriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateIssueRequest {

    @NotNull
    private IssueCategory category;

    @NotBlank
    private String description;

    @NotBlank
    private String location;

    // optional but recommended
    private Double latitude;
    private Double longitude;

    @NotNull
    private IssuePriority priority;
}
