
package com.studybuddy.taskservice.controller;

import com.studybuddy.taskservice.model.Progress;
import com.studybuddy.taskservice.service.ProgressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/progress")
public class ProgressController {

    @Autowired
    private ProgressService progressService;

    @GetMapping("/{taskId}")
    public Progress getProgress(@PathVariable Long taskId) {
        return progressService.getProgressByTaskId(taskId);
    }
}

