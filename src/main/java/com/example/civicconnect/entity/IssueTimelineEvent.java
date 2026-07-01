package com.example.civicconnect.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "issue_timeline_events")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IssueTimelineEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "issue_id", nullable = false)
    private Long issueId;

    // CREATED | STATUS_CHANGE | REMARK_ADDED
    @Column(nullable = false)
    private String eventType;

    @Column(nullable = false, length = 500)
    private String description;

    @Column(nullable = false)
    private String performedBy; // admin email or "System"

    @Builder.Default
    @Column(nullable = false)
    private LocalDateTime timestamp = LocalDateTime.now();
}
