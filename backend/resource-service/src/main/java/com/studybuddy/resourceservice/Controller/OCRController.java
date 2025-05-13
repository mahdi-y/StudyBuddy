    package com.studybuddy.resourceservice.Controller;

    import com.studybuddy.resourceservice.Service.OCRService;
    import org.springframework.http.HttpHeaders;
    import org.springframework.http.HttpStatus;
    import org.springframework.http.MediaType;
    import org.springframework.http.ResponseEntity;
    import org.springframework.web.bind.annotation.*;
    import org.springframework.web.multipart.MultipartFile;

    import java.util.Base64;
    import java.util.Map;

    @RestController
    @RequestMapping("/api/ocr")
    @CrossOrigin(origins = "http://192.168.1.64:30080")  // Allow CORS from Angular frontend
    public class OCRController {

        private final OCRService ocrService;

        public OCRController(OCRService ocrService) {
            this.ocrService = ocrService;
        }

        @PostMapping("/upload-ocr")
        public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) {
            try {
                byte[] pdfBytes = ocrService.processImageToPdf(file);

                // Convert the byte array to Base64 string
                String base64Pdf = Base64.getEncoder().encodeToString(pdfBytes);

                // Return the Base64 string so the frontend can handle it
                return ResponseEntity.ok(Map.of("base64File", base64Pdf));

            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error during OCR processing");
            }
        }

    }
