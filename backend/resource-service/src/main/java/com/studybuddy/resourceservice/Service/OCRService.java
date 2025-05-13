package com.studybuddy.resourceservice.Service;

import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.TesseractException;
import org.apache.pdfbox.pdmodel.*;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;

@Service
public class OCRService {

    // For setting the Tesseract datapath dynamically or fallback to default
    private static final String TESSERACT_DATAPATH = System.getenv("TESSERACT_DATAPATH") != null ?
            System.getenv("TESSERACT_DATAPATH") : "/usr/share/tesseract-ocr/4.00/tessdata";  // Adjust for your system

    public byte[] processImageToPdf(MultipartFile file) throws IOException, TesseractException {
        // Save the image temporarily
        File tempFile = File.createTempFile("upload", getFileExtension(file.getOriginalFilename()));
        file.transferTo(tempFile);

        // Set the TESSDATA_PREFIX system property dynamically if required (Windows)
        System.setProperty("TESSDATA_PREFIX", "/usr/share/tesseract-ocr/4.00/"); // Adjust if needed

        // OCR with Tesseract
        Tesseract tesseract = new Tesseract();
        tesseract.setDatapath(TESSERACT_DATAPATH);  // Make sure path is correct
        String extractedText = tesseract.doOCR(tempFile);  // Perform OCR on the image

        // Generate PDF with PDFBox
        PDDocument document = new PDDocument();
        PDPage page = new PDPage(PDRectangle.A4);
        document.addPage(page);

        PDPageContentStream contentStream = new PDPageContentStream(document, page);
        contentStream.setFont(PDType1Font.HELVETICA, 12);
        contentStream.beginText();
        contentStream.setLeading(14.5f);
        contentStream.newLineAtOffset(50, 750);

        for (String line : extractedText.split("\n")) {
            contentStream.showText(line);  // Add the OCR text to the PDF
            contentStream.newLine();
        }

        contentStream.endText();
        contentStream.close();

        ByteArrayOutputStream output = new ByteArrayOutputStream();
        document.save(output);  // Save the document to output stream
        document.close();

        tempFile.delete();  // Clean up temporary file

        return output.toByteArray();  // Return PDF as byte array
    }

    // Helper method to get the file extension of the uploaded file
    private String getFileExtension(String filename) {
        if (filename != null && filename.contains(".")) {
            return filename.substring(filename.lastIndexOf("."));
        }
        return ".jpg";  // Default to .jpg if extension is not found
    }
}
