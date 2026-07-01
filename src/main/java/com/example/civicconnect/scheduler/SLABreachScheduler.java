package com.example.civicconnect.scheduler;

import com.example.civicconnect.entity.Issue;
import com.example.civicconnect.entity.IssueStatus;
import com.example.civicconnect.entity.IssueTimelineEvent;
import com.example.civicconnect.repository.IssueRepository;
import com.example.civicconnect.repository.IssueTimelineEventRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class SLABreachScheduler {

    private static final Logger log = LoggerFactory.getLogger(SLABreachScheduler.class);

    private final IssueRepository issueRepository;
    private final IssueTimelineEventRepository timelineEventRepository;

    public SLABreachScheduler(
            IssueRepository issueRepository,
            IssueTimelineEventRepository timelineEventRepository
    ) {
        this.issueRepository = issueRepository;
        this.timelineEventRepository = timelineEventRepository;
    }

    // Run every 60 seconds to evaluate unresolved issues
    @Scheduled(fixedDelay = 60000)
    public void checkSLABreaches() {
        log.info("Checking unresolved reports for SLA breaches...");
        List<Issue> activeIssues = issueRepository.findAll().stream()
                .filter(i -> i.getStatus() == IssueStatus.OPEN || i.getStatus() == IssueStatus.IN_PROGRESS)
                .toList();

        LocalDateTime now = LocalDateTime.now();

        for (Issue issue : activeIssues) {
            // SLA threshold mappings (Demo: 2 mins for HIGH, 5 mins for MEDIUM, 10 mins for LOW)
            long thresholdMinutes = switch (issue.getPriority()) {
                case HIGH -> 2;
                case MEDIUM -> 5;
                case LOW -> 10;
            };

            if (issue.getCreatedAt() != null && issue.getCreatedAt().plusMinutes(thresholdMinutes).isBefore(now)) {
                // Check if an SLA_BREACH timeline event has already been registered
                boolean alreadyBreached = timelineEventRepository.findByIssueIdOrderByTimestampAsc(issue.getId())
                        .stream()
                        .anyMatch(e -> "SLA_BREACH".equals(e.getEventType()));

                if (!alreadyBreached) {
                    log.warn("SLA breach detected on Issue ID: {}", issue.getId());
                    
                    timelineEventRepository.save(IssueTimelineEvent.builder()
                            .issueId(issue.getId())
                            .eventType("SLA_BREACH")
                            .description("System Escalation Alert: Unresolved status past SLA threshold of " + thresholdMinutes + " minutes.")
                            .performedBy("SLA Monitor Service")
                            .timestamp(now)
                            .build());
                }
            }
        }
    }
}
