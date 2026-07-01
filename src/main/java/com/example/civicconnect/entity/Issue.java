package com.example.civicconnect.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "issues")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Issue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ✅ ENUM instead of String
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private IssueCategory category;

    @Column(nullable = false, length = 500)
    private String description;

    // ✅ Human readable location
    @Column(nullable = false)
    private String location;

    // ✅ REAL MAP PIN
    private Double latitude;
    private Double longitude;

    // ✅ Priority (Low / Medium / High)
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private IssuePriority priority;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private IssueStatus status;
    // OPEN, IN_PROGRESS, RESOLVED

    @Column(nullable = false)
    private Long citizenId;

@Column(nullable = false)
private boolean statusViewed = false;

@Column(length = 500)
private String adminRemark;
    // ✅ Image URLs (optional)
@ElementCollection
@CollectionTable(
    name = "issue_images",
    joinColumns = @JoinColumn(name = "issue_id", referencedColumnName = "id")
)
@Column(name = "image_url")
private List<String> imageUrls;

    @Builder.Default
    @Column(name = "upvote_count", nullable = false)
    private Integer upvoteCount = 0;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = IssueStatus.OPEN;
        }
    }
}
