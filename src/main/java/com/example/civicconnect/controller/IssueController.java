package com.example.civicconnect.controller;

import com.example.civicconnect.dto.CreateIssueRequest;
import com.example.civicconnect.entity.Citizen;
import com.example.civicconnect.entity.Issue;
import com.example.civicconnect.entity.IssueStatus;
import com.example.civicconnect.service.CitizenService;
import com.example.civicconnect.service.IssueService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.example.civicconnect.dto.IssueResponseDTO;
import com.example.civicconnect.dto.TimelineEventDTO;
import java.util.List;
import java.util.Map;
@RestController
@RequestMapping("/api/issues")
@RequiredArgsConstructor
public class IssueController {

    private final IssueService issueService;
    private final CitizenService citizenService;


@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
@PreAuthorize("hasRole('USER')")
public ResponseEntity<IssueResponseDTO> createIssue(
        @RequestPart("data") @Valid CreateIssueRequest request,
        @RequestPart(value = "images", required = false) List<MultipartFile> images,
        Authentication authentication
) {
    Citizen citizen = citizenService.findByEmail(authentication.getName());
    return ResponseEntity.ok(
            issueService.createIssue(request, images, citizen)
    );
}

    // 🔹 Admin: get all issues
@PreAuthorize("hasRole('ADMIN')")
@GetMapping
public ResponseEntity<List<IssueResponseDTO>> getAllIssues() {
    return ResponseEntity.ok(issueService.getAllIssues());
}


    // 🔹 Citizen: get own issues
@PreAuthorize("hasRole('USER')")
@GetMapping("/my")
public ResponseEntity<List<IssueResponseDTO>> getMyIssues(Authentication authentication) {
    return ResponseEntity.ok(
            issueService.getIssuesForLoggedInCitizen(authentication.getName())
    );
}
@PreAuthorize("hasAnyRole('ADMIN', 'USER')")
@GetMapping("/{id}")
public ResponseEntity<IssueResponseDTO> getIssueById(
        @PathVariable Long id,
        Authentication authentication
) {
    IssueResponseDTO issue = issueService.getIssueById(id);
    return ResponseEntity.ok(issue);
}



    // 🔹 Admin: update issue status
@PreAuthorize("hasRole('ADMIN')")
@PutMapping("/{id}/status")
public ResponseEntity<IssueResponseDTO> updateStatus(
        @PathVariable Long id,
        @RequestParam IssueStatus status
) {
    return ResponseEntity.ok(issueService.updateStatus(id, status));
}

@PreAuthorize("hasRole('ADMIN')")
@DeleteMapping("/{id}")
public ResponseEntity<String> deleteIssue(@PathVariable Long id) {
    issueService.deleteIssue(id);
    return ResponseEntity.ok("Issue deleted successfully");
}

@PreAuthorize("hasRole('USER')")
@PutMapping("/{id}/viewed")
public ResponseEntity<String> markAsViewed(@PathVariable Long id) {
    issueService.markIssueAsViewed(id);
    return ResponseEntity.ok("Marked as viewed");
}

@PreAuthorize("hasRole('ADMIN')")
@PutMapping("/{id}/remark")
public ResponseEntity<IssueResponseDTO> updateRemark(
        @PathVariable Long id,
        @RequestParam String remark
) {
    return ResponseEntity.ok(
            issueService.updateRemark(id, remark)
    );
}

@PreAuthorize("hasRole('ADMIN')")
@PutMapping("/batch/status")
public ResponseEntity<Void> batchUpdateStatus(
        @RequestBody List<Long> ids,
        @RequestParam IssueStatus status
) {
    issueService.batchUpdateStatus(ids, status);
    return ResponseEntity.ok().build();
}

@PreAuthorize("hasRole('ADMIN')")
@GetMapping("/stats")
public ResponseEntity<Map<String, Object>> getStats() {
    return ResponseEntity.ok(issueService.getIssueStatistics());
}

@PreAuthorize("hasRole('USER')")
@GetMapping("/community")
public ResponseEntity<List<IssueResponseDTO>> getCommunityIssues(
        @RequestParam(required = false) Double latitude,
        @RequestParam(required = false) Double longitude,
        @RequestParam(required = false) Double radiusKm
) {
    return ResponseEntity.ok(issueService.getCommunityIssues(latitude, longitude, radiusKm));
}

@PreAuthorize("hasRole('USER')")
@PostMapping("/{id}/upvote")
public ResponseEntity<IssueResponseDTO> upvoteIssue(
        @PathVariable Long id,
        Authentication authentication
) {
    return ResponseEntity.ok(issueService.upvoteIssue(id, authentication.getName()));
}

@PreAuthorize("hasRole('USER')")
@DeleteMapping("/{id}/upvote")
public ResponseEntity<IssueResponseDTO> downvoteIssue(
        @PathVariable Long id,
        Authentication authentication
) {
    return ResponseEntity.ok(issueService.downvoteIssue(id, authentication.getName()));
}

@PreAuthorize("hasAnyRole('USER', 'ADMIN')")
@GetMapping("/{id}/timeline")
public ResponseEntity<List<TimelineEventDTO>> getTimeline(@PathVariable Long id) {
    return ResponseEntity.ok(issueService.getTimeline(id));
}

}
