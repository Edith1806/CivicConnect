package com.example.civicconnect.repository;

import com.example.civicconnect.entity.IssueUpvote;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface IssueUpvoteRepository extends JpaRepository<IssueUpvote, Long> {
    Optional<IssueUpvote> findByIssueIdAndCitizenId(Long issueId, Long citizenId);
    boolean existsByIssueIdAndCitizenId(Long issueId, Long citizenId);
    long countByIssueId(Long issueId);
}
