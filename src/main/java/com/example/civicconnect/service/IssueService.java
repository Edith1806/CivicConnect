package com.example.civicconnect.service;

import com.example.civicconnect.dto.CreateIssueRequest;
import com.example.civicconnect.entity.Citizen;
import com.example.civicconnect.entity.Issue;
import com.example.civicconnect.entity.IssueStatus;
import com.example.civicconnect.repository.IssueRepository;
import com.example.civicconnect.repository.CitizenRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import com.example.civicconnect.entity.IssuePriority;
import com.example.civicconnect.dto.IssueResponseDTO;
import com.example.civicconnect.dto.TimelineEventDTO;
import com.example.civicconnect.entity.IssueUpvote;
import com.example.civicconnect.entity.IssueTimelineEvent;
import com.example.civicconnect.repository.IssueUpvoteRepository;
import com.example.civicconnect.repository.IssueTimelineEventRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Caching;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.*;

@Service
public class IssueService {

    private final IssueRepository issueRepository;
    private final CitizenRepository citizenRepository;
    private final IssueUpvoteRepository issueUpvoteRepository;
    private final IssueTimelineEventRepository timelineEventRepository;
    private final AITriageService aiTriageService;

    public IssueService(
            IssueRepository issueRepository,
            CitizenRepository citizenRepository,
            IssueUpvoteRepository issueUpvoteRepository,
            IssueTimelineEventRepository timelineEventRepository,
            AITriageService aiTriageService
    ) {
        this.issueRepository = issueRepository;
        this.citizenRepository = citizenRepository;
        this.issueUpvoteRepository = issueUpvoteRepository;
        this.timelineEventRepository = timelineEventRepository;
        this.aiTriageService = aiTriageService;
    }

    @Value("${app.upload.dir}")
    private String uploadDir;

    private IssueResponseDTO mapToResponse(Issue issue) {
        Citizen citizen = citizenRepository
            .findById(issue.getCitizenId())
            .orElse(null);

        boolean upvoted = false;
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !(auth instanceof AnonymousAuthenticationToken)) {
            String email = auth.getName();
            Optional<Citizen> currentCitizenOpt = citizenRepository.findByEmail(email);
            if (currentCitizenOpt.isPresent()) {
                upvoted = issueUpvoteRepository.existsByIssueIdAndCitizenId(issue.getId(), currentCitizenOpt.get().getId());
            }
        }

        return new IssueResponseDTO(
                issue.getId(),
                issue.getCategory().name(),
                issue.getDescription(),
                issue.getLocation(),
                issue.getLatitude(),
                issue.getLongitude(),
                issue.getPriority().name(),
                issue.getStatus().name(),
                issue.getImageUrls(),
                issue.isStatusViewed(),
                citizen != null ? citizen.getName() : null,
                citizen != null ? citizen.getEmail() : null,
                issue.getAdminRemark(),
                issue.getCreatedAt(),
                issue.getUpvoteCount() != null ? issue.getUpvoteCount() : 0,
                upvoted
        );
    }


@Transactional
@CacheEvict(value = "statistics", key = "'global'")
public IssueResponseDTO createIssue(
        CreateIssueRequest request,
        List<MultipartFile> images,
        Citizen citizen
) {
    IssuePriority selectedPriority = request.getPriority();
    if (selectedPriority == null) {
        selectedPriority = aiTriageService.determinePriority(request.getDescription());
    }

    Issue issue = Issue.builder()
            .category(request.getCategory())
            .description(request.getDescription())
            .location(request.getLocation())
            .latitude(request.getLatitude())
            .longitude(request.getLongitude())
            .priority(selectedPriority)
            .status(IssueStatus.OPEN)
            .citizenId(citizen.getId())
            .build();

    if (images != null && !images.isEmpty()) {
        List<String> imageUrls = images.stream()
                .filter(file -> !file.isEmpty())
                .map(this::storeImage)
                .toList();
        issue.setImageUrls(imageUrls);
    }

    Issue saved = issueRepository.save(issue);
    issueRepository.flush();

    // 📋 Record CREATED timeline event
    timelineEventRepository.save(IssueTimelineEvent.builder()
            .issueId(saved.getId())
            .eventType("CREATED")
            .description("Issue reported: " + saved.getCategory().name() + " at " + saved.getLocation())
            .performedBy(citizen.getEmail())
            .timestamp(LocalDateTime.now())
            .build());

    // 🤖 Record AI_TRIAGE timeline event
    IssuePriority aiPriority = aiTriageService.determinePriority(saved.getDescription());
    timelineEventRepository.save(IssueTimelineEvent.builder()
            .issueId(saved.getId())
            .eventType("AI_TRIAGE")
            .description("AI Auto-triage: Priority classified as " + aiPriority.name() + " based on description keyword analysis.")
            .performedBy("AI Assistant")
            .timestamp(LocalDateTime.now().plusSeconds(1))
            .build());

    return mapToResponse(saved);
}



private String storeImage(MultipartFile file) {

    // 1️⃣ Empty check
    if (file == null || file.isEmpty()) {
        throw new IllegalArgumentException("Empty file is not allowed");
    }

    // 2️⃣ Content type check
    String contentType = file.getContentType();
    if (contentType == null || !contentType.startsWith("image/")) {
        throw new IllegalArgumentException("Only image files are allowed");
    }

    // 3️⃣ File size check (max 5MB)
    long maxSize = 5 * 1024 * 1024; // 5MB
    if (file.getSize() > maxSize) {
        throw new IllegalArgumentException("Image size must be less than 5MB");
    }

    try {
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path uploadPath = Paths.get(uploadDir);

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return "/uploads/issues/" + fileName;

    } catch (IOException e) {
        throw new RuntimeException("Image upload failed", e);
    }
}


    // 🔹 Admin
public List<IssueResponseDTO> getAllIssues() {
    return issueRepository.findAll()
            .stream()
            .map(this::mapToResponse)
            .toList();
}


    // 🔹 Admin
@Transactional
@Caching(evict = {
    @CacheEvict(value = "issues", key = "#id"),
    @CacheEvict(value = "timeline", key = "#id"),
    @CacheEvict(value = "statistics", key = "'global'")
})
public IssueResponseDTO updateStatus(Long id, IssueStatus newStatus) {

    Issue issue = issueRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Issue not found"));

    if (!isValidTransition(issue.getStatus(), newStatus)) {
        throw new IllegalStateException("Invalid status transition");
    }

    IssueStatus oldStatus = issue.getStatus();
    issue.setStatus(newStatus);

    // 🔥 IMPORTANT: mark as NOT viewed
    issue.setStatusViewed(false);

    Issue saved = issueRepository.save(issue);

    // 📋 Record STATUS_CHANGE timeline event
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    String adminEmail = (auth != null) ? auth.getName() : "Admin";
    timelineEventRepository.save(IssueTimelineEvent.builder()
            .issueId(saved.getId())
            .eventType("STATUS_CHANGE")
            .description("Status changed from " + oldStatus.name() + " to " + newStatus.name())
            .performedBy(adminEmail)
            .timestamp(LocalDateTime.now())
            .build());

    return mapToResponse(saved);
}



private boolean isValidTransition(IssueStatus current, IssueStatus next) {
    return true; // since only ADMIN can call updateStatus anyway
}


public List<IssueResponseDTO> getIssuesForLoggedInCitizen(String email) {

    Citizen citizen = citizenRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Citizen not found"));

    return issueRepository.findByCitizenId(citizen.getId())
            .stream()
            .map(this::mapToResponse)
            .toList();
}


@Transactional
@Caching(evict = {
    @CacheEvict(value = "issues", key = "#issueId"),
    @CacheEvict(value = "timeline", key = "#issueId"),
    @CacheEvict(value = "statistics", key = "'global'")
})
public void deleteIssue(Long issueId) {

    Issue issue = issueRepository.findById(issueId)
            .orElseThrow(() -> new RuntimeException("Issue not found"));

    // 🔥 Delete images from disk
    if (issue.getImageUrls() != null) {
        issue.getImageUrls().forEach(this::deleteImageFromDisk);
    }

    issueRepository.delete(issue);
}
private void deleteImageFromDisk(String imageUrl) {
    try {
        String fileName = imageUrl.replace("/uploads/issues/", "");
        Path path = Paths.get(uploadDir).resolve(fileName);
        Files.deleteIfExists(path);
    } catch (IOException e) {
        throw new RuntimeException("Failed to delete image", e);
    }
}

@Transactional
public void markIssueAsViewed(Long id) {
    Issue issue = issueRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Issue not found"));

    issue.setStatusViewed(true);
}

@Cacheable(value = "issues", key = "#id")
public IssueResponseDTO getIssueById(Long id) {

    Issue issue = issueRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Issue not found"));

    return mapToResponse(issue);
}

@Transactional
@Caching(evict = {
    @CacheEvict(value = "issues", key = "#id"),
    @CacheEvict(value = "timeline", key = "#id")
})
public IssueResponseDTO updateRemark(Long id, String remark) {

    Issue issue = issueRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Issue not found"));

    issue.setAdminRemark(remark);
    issue.setStatusViewed(true);

    Issue saved = issueRepository.save(issue);

    // 📋 Record REMARK_ADDED timeline event
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    String adminEmail = (auth != null) ? auth.getName() : "Admin";
    timelineEventRepository.save(IssueTimelineEvent.builder()
            .issueId(saved.getId())
            .eventType("REMARK_ADDED")
            .description("Admin note: " + remark)
            .performedBy(adminEmail)
            .timestamp(LocalDateTime.now())
            .build());

    return mapToResponse(saved);
}

@Transactional
@CacheEvict(value = {"issues", "timeline", "statistics"}, allEntries = true)
public void batchUpdateStatus(List<Long> ids, IssueStatus status) {

    List<Issue> issues = issueRepository.findAllById(ids);

    for (Issue issue : issues) {
        issue.setStatus(status);
    }

    issueRepository.saveAll(issues);
}

@Cacheable(value = "statistics", key = "'global'")
public Map<String, Object> getIssueStatistics() {

    List<Issue> issues = issueRepository.findAll();

    long total = issues.size();
    long open = issues.stream().filter(i -> i.getStatus() == IssueStatus.OPEN).count();
    long inProgress = issues.stream().filter(i -> i.getStatus() == IssueStatus.IN_PROGRESS).count();
    long resolved = issues.stream().filter(i -> i.getStatus() == IssueStatus.RESOLVED).count();
    long closed = issues.stream().filter(i -> i.getStatus() == IssueStatus.CLOSED).count();

    long low = issues.stream().filter(i -> i.getPriority() == IssuePriority.LOW).count();
    long medium = issues.stream().filter(i -> i.getPriority() == IssuePriority.MEDIUM).count();
    long high = issues.stream().filter(i -> i.getPriority() == IssuePriority.HIGH).count();

    Map<String, Object> stats = new HashMap<>();
    stats.put("total", total);
    stats.put("open", open);
    stats.put("inProgress", inProgress);
    stats.put("resolved", resolved);
    stats.put("closed", closed);

    stats.put("low", low);
    stats.put("medium", medium);
    stats.put("high", high);

    return stats;
}

private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
    double earthRadius = 6371.0; // kilometers
    double dLat = Math.toRadians(lat2 - lat1);
    double dLon = Math.toRadians(lon2 - lon1);
    double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
               Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
               Math.sin(dLon / 2) * Math.sin(dLon / 2);
    double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadius * c;
}

public List<IssueResponseDTO> getCommunityIssues(Double latitude, Double longitude, Double radiusKm) {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    Long currentCitizenId = null;
    if (auth != null && auth.isAuthenticated() && !(auth instanceof AnonymousAuthenticationToken)) {
        String email = auth.getName();
        currentCitizenId = citizenRepository.findByEmail(email)
            .map(Citizen::getId)
            .orElse(null);
    }

    List<Issue> allIssues = issueRepository.findAll();
    final Long finalCurrentCitizenId = currentCitizenId;
    List<Issue> otherIssues = allIssues.stream()
        .filter(issue -> finalCurrentCitizenId == null || !issue.getCitizenId().equals(finalCurrentCitizenId))
        .toList();

    if (latitude != null && longitude != null) {
        double radius = (radiusKm != null) ? radiusKm : 10.0;
        record IssueDistance(Issue issue, double distance) {}

        List<IssueDistance> matching = new ArrayList<>();
        for (Issue issue : otherIssues) {
            if (issue.getLatitude() != null && issue.getLongitude() != null) {
                double dist = calculateDistance(latitude, longitude, issue.getLatitude(), issue.getLongitude());
                if (dist <= radius) {
                    matching.add(new IssueDistance(issue, dist));
                }
            }
        }

        matching.sort(Comparator.comparingDouble(IssueDistance::distance));
        return matching.stream()
            .map(idist -> mapToResponse(idist.issue))
            .toList();
    } else {
        List<Issue> sorted = new ArrayList<>(otherIssues);
        sorted.sort((a, b) -> {
            if (a.getCreatedAt() == null || b.getCreatedAt() == null) return 0;
            return b.getCreatedAt().compareTo(a.getCreatedAt());
        });
        return sorted.stream()
            .map(this::mapToResponse)
            .toList();
    }
}

@Transactional
@Caching(evict = {
    @CacheEvict(value = "issues", key = "#issueId"),
    @CacheEvict(value = "statistics", key = "'global'")
})
public IssueResponseDTO upvoteIssue(Long issueId, String citizenEmail) {
    Issue issue = issueRepository.findById(issueId)
            .orElseThrow(() -> new RuntimeException("Issue not found"));

    Citizen citizen = citizenRepository.findByEmail(citizenEmail)
            .orElseThrow(() -> new RuntimeException("Citizen not found"));

    if (issueUpvoteRepository.existsByIssueIdAndCitizenId(issueId, citizen.getId())) {
        return mapToResponse(issue);
    }

    IssueUpvote upvote = IssueUpvote.builder()
            .issueId(issueId)
            .citizenId(citizen.getId())
            .build();

    issueUpvoteRepository.save(upvote);

    int currentCount = issue.getUpvoteCount() != null ? issue.getUpvoteCount() : 0;
    issue.setUpvoteCount(currentCount + 1);

    if (issue.getUpvoteCount() >= 10 && issue.getPriority() != IssuePriority.HIGH) {
        issue.setPriority(IssuePriority.HIGH);
    }

    return mapToResponse(issueRepository.save(issue));
}

@Transactional
@Caching(evict = {
    @CacheEvict(value = "issues", key = "#issueId"),
    @CacheEvict(value = "statistics", key = "'global'")
})
public IssueResponseDTO downvoteIssue(Long issueId, String citizenEmail) {
    Issue issue = issueRepository.findById(issueId)
            .orElseThrow(() -> new RuntimeException("Issue not found"));

    Citizen citizen = citizenRepository.findByEmail(citizenEmail)
            .orElseThrow(() -> new RuntimeException("Citizen not found"));

    Optional<IssueUpvote> upvoteOpt = issueUpvoteRepository.findByIssueIdAndCitizenId(issueId, citizen.getId());
    if (upvoteOpt.isPresent()) {
        issueUpvoteRepository.delete(upvoteOpt.get());

        int currentCount = issue.getUpvoteCount() != null ? issue.getUpvoteCount() : 0;
        issue.setUpvoteCount(Math.max(0, currentCount - 1));
        
        issueRepository.save(issue);
    }

    return mapToResponse(issue);
}

@Cacheable(value = "timeline", key = "#issueId")
public List<TimelineEventDTO> getTimeline(Long issueId) {
    return timelineEventRepository.findByIssueIdOrderByTimestampAsc(issueId)
            .stream()
            .map(e -> new TimelineEventDTO(
                    e.getId(),
                    e.getEventType(),
                    e.getDescription(),
                    e.getPerformedBy(),
                    e.getTimestamp()
            ))
            .toList();
}

}
