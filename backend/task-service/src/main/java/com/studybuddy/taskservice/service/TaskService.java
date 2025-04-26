package com.studybuddy.taskservice.service;

import com.studybuddy.taskservice.dto.TaskDTO;
import com.studybuddy.taskservice.model.Progress;
import com.studybuddy.taskservice.model.Task;
import com.studybuddy.taskservice.repository.ProgressRepository;
import com.studybuddy.taskservice.repository.TaskRepository;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
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

    // ✅ Add Task
    public Task addTask(TaskDTO taskDTO) {
        Task task = new Task();
        task.setTitle(taskDTO.getTitle());
        task.setDescription(taskDTO.getDescription());
        task.setDueDate(taskDTO.getDueDate());
        task.setCompleted(taskDTO.isCompleted());
        task.setCreatedAt(LocalDateTime.now());

        // ✅ Find or create Progress by name
        Progress progress = progressRepository.findByName(taskDTO.getProgressName())
                .orElseGet(() -> {
                    Progress newProgress = new Progress();
                    newProgress.setName(taskDTO.getProgressName());
                    newProgress.setTotalTasks(0);
                    newProgress.setTotalCompletedTasks(0);
                    newProgress.setProgressPercentage(0);
                    return progressRepository.save(newProgress);
                });

        task.setProgress(progress);
        Task savedTask = taskRepository.save(task);

        // ✅ Update progress stats
        if (task.getProgress() != null) {
            updateProgressStats(task.getProgress().getId());
        }

        return savedTask;
    }

    // ✅ Add Progress for a specific Task
    public Progress addProgress(Progress progress) {
        return progressRepository.save(progress);
    }

    // ✅ Delete Task
    @Transactional
    public void deleteTask(Long taskId) {
        Optional<Task> taskOpt = taskRepository.findById(taskId);
        if (taskOpt.isPresent()) {
            Task task = taskOpt.get();
            Long progressId = task.getProgress() != null ? task.getProgress().getId() : null;

            taskRepository.delete(task);

            if (progressId != null) {
                // Check if any tasks still have this progress
                if (!taskRepository.existsByProgressId(progressId)) {
                    progressRepository.deleteById(progressId);
                } else {
                    // ✅ Only update stats if progress still exists
                    updateProgressStats(progressId);
                }
            }
        }
    }



    // ✅ Get Task by ID
    public TaskDTO getTaskById(Long id) {
        Optional<Task> task = taskRepository.findById(id);
        if (task.isPresent()) {
            return mapToDTO(task.get());
        } else {
            throw new RuntimeException("Task not found with ID: " + id);
        }
    }

    // ✅ Get all tasks
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    // ✅ Update task method
    public TaskDTO updateTask(Long id, TaskDTO taskDTO) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Task not found with ID: " + id));

        // Store the old progress ID before making changes
        Long oldProgressId = task.getProgress() != null ? task.getProgress().getId() : null;

        // Update task fields
        task.setTitle(taskDTO.getTitle());
        task.setDescription(taskDTO.getDescription());
        task.setDueDate(taskDTO.getDueDate());
        task.setCompleted(taskDTO.isCompleted());
        task.setCreatedAt(taskDTO.getCreatedAt()); // You can keep this or remove if it's not meant to be updated

        // Set the new progress
        Progress newProgress = null;
        if (taskDTO.getProgressName() != null) {
            newProgress = progressRepository.findByName(taskDTO.getProgressName())
                    .orElseGet(() -> {
                        Progress p = new Progress();
                        p.setName(taskDTO.getProgressName());
                        p.setTotalTasks(0);
                        p.setTotalCompletedTasks(0);
                        p.setProgressPercentage(0);
                        return progressRepository.save(p);
                    });
            task.setProgress(newProgress);
        } else {
            task.setProgress(null); // Allow null progress if not provided
        }

        // Save updated task
        Task updatedTask = taskRepository.save(task);

        // Refresh stats:
        // 1. Update old progress stats if progress changed
        if (oldProgressId != null && (newProgress == null || !oldProgressId.equals(newProgress.getId()))) {
            updateProgressStats(oldProgressId);
        }

        // 2. Update new progress stats (even if it's the same)
        if (newProgress != null) {
            updateProgressStats(newProgress.getId());
        }

        return mapToDTO(updatedTask);
    }



    // ✅ Update progress stats helper
    public void updateProgressStats(Long progressId) {
        Progress progress = progressRepository.findById(progressId)
                .orElseThrow(() -> new RuntimeException("Progress not found"));

        List<Task> tasks = taskRepository.findByProgressId(progressId);

        int total = tasks.size();
        int completed = (int) tasks.stream().filter(Task::isCompleted).count();
        double percentage = total == 0 ? 0.0 : (completed * 100.0 / total);

        progress.setTotalTasks(total);
        progress.setTotalCompletedTasks(completed);
        progress.setProgressPercentage(percentage);

        progressRepository.save(progress);
    }

    // ✅ Map Task to TaskDTO
    private TaskDTO mapToDTO(Task task) {
        TaskDTO taskDTO = new TaskDTO();
        taskDTO.setTitle(task.getTitle());
        taskDTO.setDescription(task.getDescription());
        taskDTO.setDueDate(task.getDueDate());
        taskDTO.setCompleted(task.isCompleted());
        taskDTO.setCreatedAt(task.getCreatedAt());

        if (task.getProgress() != null) {
            taskDTO.setProgressName(task.getProgress().getName());
        }

        return taskDTO;
    }
}
