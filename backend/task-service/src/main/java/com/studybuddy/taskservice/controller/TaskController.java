package com.studybuddy.taskservice.controller;
import com.studybuddy.taskservice.dto.TaskDTO;
import com.studybuddy.taskservice.dto.ProgressDTO;
import com.studybuddy.taskservice.model.Task;
import com.studybuddy.taskservice.model.Progress;
import com.studybuddy.taskservice.repository.ProgressRepository;
import com.studybuddy.taskservice.repository.TaskRepository;
import com.studybuddy.taskservice.service.TaskService;
import jakarta.transaction.Transactional;
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
        // Create a new Task object
        Task task = new Task();
        task.setTitle(taskDTO.getTitle());
        task.setDescription(taskDTO.getDescription());
        task.setDueDate(taskDTO.getDueDate());
        task.setCompleted(taskDTO.isCompleted());
        task.setCreatedAt(LocalDateTime.now());

        Progress progress;

        // If progressId is provided, associate the task with the existing progress
        if (taskDTO.getProgressId() != null) {
            progress = progressRepository.findById(taskDTO.getProgressId())
                    .orElseThrow(() -> new IllegalArgumentException("Progress not found"));
        } else {
            // If no progressId is provided, check if a Progress with the given name already exists
            if (taskDTO.getProgressName() != null && !taskDTO.getProgressName().isEmpty()) {
                progress = progressRepository.findByName(taskDTO.getProgressName())
                        .orElseGet(() -> {
                            // If no existing Progress is found, create a new Progress
                            Progress newProgress = new Progress();
                            newProgress.setName(taskDTO.getProgressName());  // Set the name from the request
                            return progressRepository.save(newProgress);  // Save the new Progress and return it
                        });
            } else {
                // If no progressName is provided, create a new Progress with a default name
                progress = new Progress();
                progress.setName("New Progress");
                progress = progressRepository.save(progress);  // Save the new Progress
            }
        }

        // Associate the task with the found or created progress (now we are sure it's not null)
        task.setProgress(progress);

        // Save the task to the repository
        Task savedTask = taskRepository.save(task);
// Update progress statistics after adding the new task
        taskService.updateProgressStats(progress.getId());
        // Create and return the TaskDTO response
        TaskDTO taskDTOResponse = new TaskDTO();
        taskDTOResponse.setId(savedTask.getId());
        taskDTOResponse.setTitle(savedTask.getTitle());
        taskDTOResponse.setDescription(savedTask.getDescription());
        taskDTOResponse.setDueDate(savedTask.getDueDate());
        taskDTOResponse.setCreatedAt(savedTask.getCreatedAt());
        taskDTOResponse.setCompleted(savedTask.isCompleted());
        taskDTOResponse.setProgressId(savedTask.getProgress() != null ? savedTask.getProgress().getId() : null);

        // Set progressName based on the associated Progress (if exists)
        if (savedTask.getProgress() != null) {
            taskDTOResponse.setProgressName(savedTask.getProgress().getName());
        } else {
            taskDTOResponse.setProgressName(null);
        }

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


    @DeleteMapping("/delete/{id}")
    @Transactional
    public ResponseEntity<List<Task>> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);  // This deletes the task and, if applicable, its progress
        // Now fetch the updated list of tasks
        List<Task> updatedTasks = taskService.getAllTasks();
        return ResponseEntity.ok(updatedTasks);
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

        // If progressId is provided, update task with the given progressId
        if (taskDTO.getProgressId() != null) {
            Progress progress = progressRepository.findById(taskDTO.getProgressId())
                    .orElseThrow(() -> new IllegalArgumentException("Progress not found"));
            existingTask.setProgress(progress);  // Update task with progressId
        }

        // If progressName is provided, find the existing Progress by name and set the progressId
        if (taskDTO.getProgressName() != null && !taskDTO.getProgressName().isEmpty()) {
            // Find the existing progress by name
            Progress progress = progressRepository.findByName(taskDTO.getProgressName())
                    .orElseThrow(() -> new IllegalArgumentException("Progress with the given name does not exist"));

            // Update the task's progress with the found progress ID
            existingTask.setProgress(progress);  // Set task's progress to the existing progress ID
        }

        // Save the updated task
        Task updatedTask = taskRepository.save(existingTask);

        // Convert the updated task to DTO for the response
        TaskDTO taskDTOResponse = new TaskDTO();
        taskDTOResponse.setId(updatedTask.getId());
        taskDTOResponse.setTitle(updatedTask.getTitle());
        taskDTOResponse.setDescription(updatedTask.getDescription());
        taskDTOResponse.setDueDate(updatedTask.getDueDate());
        taskDTOResponse.setCreatedAt(updatedTask.getCreatedAt());  // Keep the original createdAt
        taskDTOResponse.setCompleted(updatedTask.isCompleted());
        taskDTOResponse.setProgressId(updatedTask.getProgress() != null ? updatedTask.getProgress().getId() : null);

        // Set the progress name in the response
        if (updatedTask.getProgress() != null) {
            taskDTOResponse.setProgressName(updatedTask.getProgress().getName());
        } else {
            taskDTOResponse.setProgressName(null);
        }

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