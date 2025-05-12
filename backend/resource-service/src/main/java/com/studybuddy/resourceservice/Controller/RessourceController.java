package com.studybuddy.resourceservice.Controller;

import com.studybuddy.resourceservice.Entity.Ressource;
import com.studybuddy.resourceservice.Repository.RessourceRepository;
import com.studybuddy.resourceservice.Service.OCRService;
import com.studybuddy.resourceservice.Service.RessourceService;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.sql.Timestamp;
import java.util.Base64;
import java.util.List;

@Validated
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/ressources")
public class RessourceController {

    @Autowired
    private RessourceService ressourceService;

    @Autowired
    private OCRService ocrService;
    @Autowired
    private RessourceRepository ressourceRepository;

    @GetMapping
    public List<Ressource> getAll() {
        return ressourceService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ressource> getOne(@PathVariable Long id) {
        return ressourceService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> create(
            @Valid @RequestBody Ressource ressource,
            @RequestHeader(value = "Study-Group-ID", required = false) Long studyGroupId) {
        if (studyGroupId == null) {
            return ResponseEntity.badRequest().body("Missing required header: Study-Group-ID");
        }

        Timestamp now = new Timestamp(System.currentTimeMillis());
        ressource.setUploadedAt(now);
        ressource.setUpdatedAt(now);
        ressource.setStudyGroupId(studyGroupId);

        return ResponseEntity.ok(ressourceService.save(ressource));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Ressource> update(@PathVariable Long id, @RequestBody Ressource updated) {
        return ressourceService.findById(id).map(ressource -> {
            ressource.setTitle(updated.getTitle());
            ressource.setDescription(updated.getDescription());
            ressource.setFileUrl(updated.getFileUrl());
            ressource.setType(updated.getType());
            ressource.setCategory(updated.getCategory());
            ressource.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
            return ResponseEntity.ok(ressourceService.save(ressource));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        ressourceService.deleteById(id);
    }

    // NEW: Image upload with OCR and PDF generation
    @PostMapping("/upload")
    public ResponseEntity<Ressource> uploadImageAndSaveRessource(
            @RequestParam("file") MultipartFile file,  // Changed from 'fileUrl' to 'file'
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("type") String type
    ) {
        try {
            byte[] pdfBytes = ocrService.processImageToPdf(file); // Process image to PDF using OCR
            String base64Pdf = Base64.getEncoder().encodeToString(pdfBytes);  // Encode PDF as Base64

            Ressource ressource = new Ressource();
            ressource.setTitle(title);
            ressource.setDescription(description);
            ressource.setFileUrl(base64Pdf);  // Store Base64 PDF string
            ressource.setType(type);
            Timestamp now = new Timestamp(System.currentTimeMillis());
            ressource.setUploadedAt(now);
            ressource.setUpdatedAt(now);


            Ressource saved = ressourceService.save(ressource);  // Save the ressource
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();  // Handle error
        }
    }
    @GetMapping("/by-study-group")
    @Transactional
    public ResponseEntity<List<Ressource>> getResourcesByStudyGroupId(
            @RequestHeader("Study-Group-ID") Long studyGroupId) {

        List<Ressource> progresses = ressourceRepository.findByStudyGroupId(studyGroupId);
        return ResponseEntity.ok(progresses);
    }
}
