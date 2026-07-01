package com.example.civicconnect.repository;

import com.example.civicconnect.entity.Issue;
import com.example.civicconnect.entity.IssuePriority;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IssueRepository extends JpaRepository<Issue, Long> {

    List<Issue> findByCitizenId(Long citizenId);

    List<Issue> findByStatus(String status);

    List<Issue> findByPriority(IssuePriority priority);

List<Issue> findByCategoryContainingIgnoreCase(String keyword);

}
