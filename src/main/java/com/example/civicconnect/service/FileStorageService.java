package com.example.civicconnect.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${app.upload.dir}")
    private String uploadDir;


    public String saveIssueImage(MultipartFile file) {
        try {
            String folder = uploadDir + "/issues";
            File dir = new File(folder);
            if (!dir.exists()) dir.mkdirs();

            String filename =
                    UUID.randomUUID() + "_" + file.getOriginalFilename();

            Path path = Paths.get(folder, filename);
            Files.write(path, file.getBytes());

            // URL that frontend will use
            return "/uploads/issues/" + filename;

        } catch (IOException e) {
            throw new RuntimeException("Failed to store file", e);
        }
    }
}
