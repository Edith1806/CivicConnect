package com.example.civicconnect.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/issues/images")
public class IssueImageController {

    @Value("${app.upload.dir}")
    private String uploadDir;

    @PostMapping("/upload")
    public ResponseEntity<List<String>> uploadImages(
            @RequestParam("files") MultipartFile[] files
    ) {
        List<String> imageUrls = new ArrayList<>();

        try {
            File dir = new File(uploadDir);
            if (!dir.exists()) dir.mkdirs();

            for (MultipartFile file : files) {
                String fileName =
                        UUID.randomUUID() + "_" + file.getOriginalFilename();

                Path filePath = Path.of(uploadDir, fileName);
                Files.write(filePath, file.getBytes());

                imageUrls.add(
                        "http://localhost:8080/uploads/issues/" + fileName
                );
            }

            return ResponseEntity.ok(imageUrls);

        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
