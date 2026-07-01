package com.example.civicconnect.repository;

import com.example.civicconnect.entity.IssueTimelineEvent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IssueTimelineEventRepository extends JpaRepository<IssueTimelineEvent, Long> {
    List<IssueTimelineEvent> findByIssueIdOrderByTimestampAsc(Long issueId);
}
