package com.studybuddy.taskservice.controller;

import com.studybuddy.taskservice.model.Progress;
import com.studybuddy.taskservice.model.Task;
import com.studybuddy.taskservice.repository.ProgressRepository;
import com.studybuddy.taskservice.service.ProgressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/progress")
public class ProgressController {

    @Autowired
    private ProgressService progressService;

    // Get progress by taskId
    @GetMapping("/{taskId}")
    public Progress getProgress(@PathVariable Long taskId) {
        return progressService.getProgressByTaskId(taskId);
    }

    // Get all progress entries
    @GetMapping("/all")
    public List<Progress> getAllProgress() {
        return progressService.getAllProgress();
    }
    // Get tasks by progress ID (fixed return type)
    @GetMapping("/{id}/tasks")
    public ResponseEntity<List<Task>> getTasksByProgressId(@PathVariable Long id) {
        return progressService.getTasksByProgressId(id);  // Return ResponseEntity as expected by the service
    }
    @DeleteMapping("/{progressId}/delete")
    public ResponseEntity<String> deleteTasksAndProgress(@PathVariable Long progressId) {
        progressService.deleteTasksAndProgressIfEmpty(progressId);
        return new ResponseEntity<>("Tasks and Progress deleted successfully if no tasks remain", HttpStatus.OK);
    }
}
