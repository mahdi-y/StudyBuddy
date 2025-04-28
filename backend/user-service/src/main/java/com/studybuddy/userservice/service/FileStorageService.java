package com.studybuddy.userservice.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${file.upload-dir:/uploads/profile-pictures}")
    private String uploadDir;

    public String storeFile(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            System.out.println("No file provided for upload");
            return null;
        }
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            System.out.println("Invalid file type: " + contentType);
            throw new IOException("Only image files are allowed");
        }
        System.out.println("Saving file: " + file.getOriginalFilename());
        Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
            System.out.println("Created directory: " + uploadPath);
        }
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath);
        System.out.println("File saved at: " + filePath);
        String relativePath = "/uploads/profile-pictures/" + fileName;
        System.out.println("Returning relative path: " + relativePath);
        return relativePath;
    }
}