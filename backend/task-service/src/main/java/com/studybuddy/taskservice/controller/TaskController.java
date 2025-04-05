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

import java.time.LocalDateTime;
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
    public ResponseEntity<TaskDTO> addTask(@RequestBody TaskDTO taskDTO) {
        Task task = new Task();
        task.setTitle(taskDTO.getTitle());
        task.setDescription(taskDTO.getDescription());
        task.setDueDate(taskDTO.getDueDate());
        task.setCompleted(taskDTO.isCompleted());

        // Set Progress if progressId is provided in TaskDTO
        if (taskDTO.getProgressId() != null) {
            Progress progress = progressRepository.findById(taskDTO.getProgressId())
                    .orElseThrow(() -> new IllegalArgumentException("Progress not found"));
            task.setProgress(progress);  // Link the task with progress
        }

        // Save task to the repository
        Task savedTask = taskRepository.save(task);

        // Create a TaskDTO response
        TaskDTO taskDTOResponse = new TaskDTO();
        taskDTOResponse.setId(savedTask.getId());
        taskDTOResponse.setTitle(savedTask.getTitle());
        taskDTOResponse.setDescription(savedTask.getDescription());
        taskDTOResponse.setDueDate(savedTask.getDueDate());
        taskDTOResponse.setCreatedAt(savedTask.getCreatedAt());
        taskDTOResponse.setCompleted(savedTask.isCompleted());
        taskDTOResponse.setProgressId(savedTask.getProgress() != null ? savedTask.getProgress().getId() : null);  // Include progressId in response

        return new ResponseEntity<>(taskDTOResponse, HttpStatus.CREATED);
    }

    // Get a Task by its ID
    @GetMapping("/get/{id}")
    public TaskDTO getTaskById(@PathVariable Long id) {
        return taskService.getTaskById(id);
    }
    @GetMapping("/tasks")
    public List<Task> getAllTasks() {
        return taskService.getAllTasks();  // Fetch tasks from the service
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
        // Fetch the task by its ID
        Task existingTask = taskRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Task not found"));

        // Preserve the original 'createdAt' value (don't update it)
        LocalDateTime originalCreatedAt = existingTask.getCreatedAt();

        // Update only the fields that are provided in the DTO
        if (taskDTO.getTitle() != null) {
            existingTask.setTitle(taskDTO.getTitle());
        }
        if (taskDTO.getDescription() != null) {
            existingTask.setDescription(taskDTO.getDescription());
        }
        if (taskDTO.getDueDate() != null) {
            existingTask.setDueDate(taskDTO.getDueDate());
        }
        if (taskDTO.isCompleted() != existingTask.isCompleted()) {
            existingTask.setCompleted(taskDTO.isCompleted());
        }

        // Retain the original 'createdAt' value
        existingTask.setCreatedAt(originalCreatedAt);

        // Update progressId if provided
        if (taskDTO.getProgressId() != null) {
            Progress progress = progressRepository.findById(taskDTO.getProgressId())
                    .orElseThrow(() -> new IllegalArgumentException("Progress not found"));
            existingTask.setProgress(progress);  // Update the progress with the new progressId
        }

        // Save the updated task
        Task updatedTask = taskRepository.save(existingTask);

        // Convert the updated task to DTO for the response
        TaskDTO taskDTOResponse = new TaskDTO();
        taskDTOResponse.setId(updatedTask.getId());
        taskDTOResponse.setTitle(updatedTask.getTitle());
        taskDTOResponse.setDescription(updatedTask.getDescription());
        taskDTOResponse.setDueDate(updatedTask.getDueDate());
        taskDTOResponse.setCreatedAt(updatedTask.getCreatedAt());  // This will remain the original createdAt
        taskDTOResponse.setCompleted(updatedTask.isCompleted());
        taskDTOResponse.setProgressId(updatedTask.getProgress() != null ? updatedTask.getProgress().getId() : null);  // Set the updated progressId

        return ResponseEntity.ok(taskDTOResponse);
    }

    @GetMapping("/progress/{id}")
    public ResponseEntity<Progress> getProgressById(@PathVariable Long id) {
        Progress progress = progressRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Progress not found with ID: " + id));

        // Get the list of tasks linked to this progress
        List<Task> tasks = taskRepository.findByProgressId(progress.getId());

        // Update values
        progress.setTotalTasks(tasks.size());
        progress.setTotalCompletedTasks((int) tasks.stream().filter(Task::isCompleted).count());

        int total = tasks.size();
        int completed = (int) tasks.stream().filter(Task::isCompleted).count();
        double percentage = total > 0 ? (completed * 100.0 / total) : 0;

        progress.setProgressPercentage(percentage);

        return new ResponseEntity<>(progress, HttpStatus.OK);
    }

}