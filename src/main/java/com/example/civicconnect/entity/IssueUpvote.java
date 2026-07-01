package com.example.civicconnect.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "issue_upvotes", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"issue_id", "citizen_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IssueUpvote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "issue_id", nullable = false)
    private Long issueId;

    @Column(name = "citizen_id", nullable = false)
    private Long citizenId;
}
