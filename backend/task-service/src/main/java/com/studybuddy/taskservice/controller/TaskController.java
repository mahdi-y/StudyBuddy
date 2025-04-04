package com.studybuddy.taskservice.controller;

import com.studybuddy.taskservice.dto.TaskDTO;
import com.studybuddy.taskservice.dto.ProgressDTO;
import com.studybuddy.taskservice.model.Task;
import com.studybuddy.taskservice.model.Progress;
import com.studybuddy.taskservice.repository.ProgressRepository;
import com.studybuddy.taskservice.repository.TaskRepository;
import com.studybuddy.taskservice.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/task")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @Autowired
    private ProgressRepository progressRepository;

    @Autowired
    private TaskRepository taskRepository;

    // Endpoint to add a Task using TaskDTO
    @PostMapping("/add")
    public ResponseEntity<Task> addTask(@RequestBody TaskDTO taskDTO) {
        // Create a new Task instance
        Task task = new Task();
        task.setTitle(taskDTO.getTitle());
        task.setDescription(taskDTO.getDescription());
        task.setDueDate(taskDTO.getDueDate());
        task.setCompleted(taskDTO.isCompleted());  // If taskDTO contains completed status

        // Set Progress if provided in TaskDTO
        if (taskDTO.getProgressId() != null) {
            Progress progress = progressRepository.findById(taskDTO.getProgressId())
                    .orElseThrow(() -> new IllegalArgumentException("Progress not found"));
            task.setProgress(progress);  // Link the task with progress
        }

        // Save task and return the saved task
        Task savedTask = taskRepository.save(task);
        return new ResponseEntity<>(savedTask, HttpStatus.CREATED);
    }

    // Get a Task by its ID
    @GetMapping("/get/{id}")
    public TaskDTO getTaskById(@PathVariable Long id) {
        return taskService.getTaskById(id);
    }

    // Delete Task by ID
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);  // Call the delete method from the service
        return ResponseEntity.ok("Task deleted successfully");
    }

    // Endpoint to add Progress for multiple Tasks using ProgressDTO
    @PostMapping("/progress")
    public ResponseEntity<Progress> addProgress(@RequestBody ProgressDTO progressDTO) {
        // Create a new Progress instance
        Progress progress = new Progress();
        progress.setProgressPercentage(progressDTO.getProgressPercentage());  // Set progress percentage
        progress.setTotalTasks(progressDTO.getTotalTasks());  // Set total tasks
        progress.setTotalCompletedTasks(progressDTO.getTotalCompletedTasks());  // Set total completed tasks

        // Save the progress entity to get an ID
        Progress savedProgress = progressRepository.save(progress);

        // Optionally, if you want to update tasks linked to this progress
        // Remove this if you don't want to automatically link tasks to progress
        if (progressDTO.getTaskIds() != null && !progressDTO.getTaskIds().isEmpty()) {
            List<Task> tasks = taskRepository.findAllById(progressDTO.getTaskIds());  // Fetch tasks by IDs
            for (Task task : tasks) {
                task.setProgress(savedProgress);  // Set the progress for each task
                taskRepository.save(task);  // Save the task with the progress foreign key set
            }
        }

        return new ResponseEntity<>(savedProgress, HttpStatus.CREATED);
    }

    // Update an existing task
    @PutMapping("/update/{id}")
    public ResponseEntity<TaskDTO> updateTask(@PathVariable Long id, @RequestBody TaskDTO taskDTO) {
        TaskDTO updatedTask = taskService.updateTask(id, taskDTO);
        return ResponseEntity.ok(updatedTask);
    }

}
