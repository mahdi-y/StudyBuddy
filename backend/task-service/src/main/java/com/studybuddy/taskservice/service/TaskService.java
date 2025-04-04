package com.studybuddy.taskservice.service;
import com.studybuddy.taskservice.service.ProgressService;
import com.studybuddy.taskservice.repository.ProgressRepository;

import com.studybuddy.taskservice.dto.TaskDTO;
import com.studybuddy.taskservice.model.Task;
import com.studybuddy.taskservice.model.Progress;
import com.studybuddy.taskservice.repository.TaskRepository;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;
    @Autowired
    private ProgressService progressService;
    @Autowired
    private ProgressRepository progressRepository;
    @Autowired
    private ModelMapper modelMapper;

    @Transactional
    public void updateTaskCompletion(Long taskId, boolean isCompleted) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Task not found"));

        task.setCompleted(isCompleted);
        taskRepository.save(task);

        // ✅ Trigger Progress Update
        progressService.updateProgress(taskId);
    }

    // Add Task
    public Task addTask(Task task) {
        return taskRepository.save(task);
    }

    // Add Progress for a specific Task
    public Progress addProgress(Progress progress) {
        return progressRepository.save(progress);
    }
    public void deleteTask(Long id) {
        // Check if the task exists before attempting to delete
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Task not found with ID: " + id));

        taskRepository.delete(task);  // Delete the task
    }
    public TaskDTO getTaskById(Long id) {
        Optional<Task> task = taskRepository.findById(id);
        if (task.isPresent()) {
            return modelMapper.map(task.get(), TaskDTO.class); // Convert Task to TaskDTO
        } else {
            throw new RuntimeException("Task not found with ID: " + id);
        }
    }
    // Update task method
    public TaskDTO updateTask(Long id, TaskDTO taskDTO) {
        // Fetch task by ID
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Task not found with ID: " + id));

        // Update task details
        task.setTitle(taskDTO.getTitle());
        task.setDescription(taskDTO.getDescription());
        task.setDueDate(taskDTO.getDueDate());
        task.setCompleted(taskDTO.isCompleted());
        task.setCreatedAt(taskDTO.getCreatedAt());  // Keep the created date as is

        // Save updated task back to the repository
        Task updatedTask = taskRepository.save(task);

        // Return updated TaskDTO
        return mapToDTO(updatedTask);
    }

    // Helper method to map Task to TaskDTO
    private TaskDTO mapToDTO(Task task) {
        TaskDTO taskDTO = new TaskDTO();
        taskDTO.setTitle(task.getTitle());
        taskDTO.setDescription(task.getDescription());
        taskDTO.setDueDate(task.getDueDate());
        taskDTO.setCompleted(task.isCompleted());
        taskDTO.setCreatedAt(task.getCreatedAt());
        return taskDTO;
    }
}
