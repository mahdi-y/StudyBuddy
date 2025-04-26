package com.studybuddy.taskservice.controller;

import com.studybuddy.taskservice.model.Progress;
import com.studybuddy.taskservice.model.Task;
import com.studybuddy.taskservice.repository.ProgressRepository;
import com.studybuddy.taskservice.service.ProgressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:4200")

@RestController
@RequestMapping("/api/progress")
public class ProgressController {

    @Autowired
    private ProgressService progressService;
    @Autowired
    private ProgressRepository progressRepository;

    // Get progress by taskId
    @GetMapping("/{taskId}")
    public Progress getProgress(@PathVariable Long taskId) {
        return progressService.getProgressByTaskId(taskId);
    }

    // Get all progress entries
    @GetMapping("/all")
    public List<Progress> getAllProgress(@RequestParam(required = false) Boolean archived) {
        if (archived != null) {
            return progressRepository.findByArchived(archived); // 👈 filter by archive if provided
        }
        return progressService.getAllProgress();
    }

    @GetMapping("/{id}/tasks")
    public ResponseEntity<List<Task>> getTasksByProgressId(@PathVariable Long id) {
        return progressService.getTasksByProgressId(id);  // Return ResponseEntity as expected by the service
    }
    @DeleteMapping("/{progressId}/delete")
    public ResponseEntity<String> deleteTasksAndProgress(@PathVariable Long progressId) {
        progressService.deleteTasksAndProgressIfEmpty(progressId);
        return new ResponseEntity<>("Tasks and Progress deleted successfully if no tasks remain", HttpStatus.OK);
    }
    @PutMapping("/{id}/archive")
    public ResponseEntity<?> archiveProgress(@PathVariable Long id) {
        Optional<Progress> optionalProgress = progressRepository.findById(id);
        if (optionalProgress.isPresent()) {
            Progress progress = optionalProgress.get();
            progress.setArchived(true);
            progressRepository.save(progress);

            // Create a map for the response
            Map<String, String> response = new HashMap<>();
            response.put("message", "Progress archived successfully.");

            // Return the map wrapped in a ResponseEntity (this will be automatically converted to JSON)
            return ResponseEntity.ok(response);
        }

        // Create a map for the error response
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("message", "Progress not found.");

        // Return the error map
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }

    @GetMapping("/archived")
    public ResponseEntity<List<Progress>> getArchivedProgresses() {
        List<Progress> archivedProgresses = progressRepository.findByArchived(true);
        return ResponseEntity.ok(archivedProgresses);
    }

}
