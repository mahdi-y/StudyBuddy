package com.studybuddy.taskservice.service;

import com.studybuddy.taskservice.model.Task;
import com.studybuddy.taskservice.model.Progress;
import com.studybuddy.taskservice.repository.TaskRepository;
import com.studybuddy.taskservice.repository.ProgressRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProgressService {

    @Autowired
    private ProgressRepository progressRepository;  // Fixed naming convention for progressRepository ff

    @Autowired
    private TaskRepository taskRepository;

    @Transactional
    public void updateProgress(Long taskId) {
        // Fetch the task by its ID
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Task not found"));

        // Find all tasks linked to the same progress (i.e., the progress that this task belongs to)
        List<Task> relatedTasks = taskRepository.findByProgressId(task.getProgress().getId());

        // Calculate progress values
        int totalTasks = relatedTasks.size();
        int totalCompletedTasks = (int) relatedTasks.stream().filter(Task::isCompleted).count();
        int progressPercentage = (totalTasks == 0) ? 0 : (totalCompletedTasks * 100) / totalTasks;

        // Find the progress entity associated with this task
        Progress progress = task.getProgress(); // Getting the progress linked to the task

        // Update the progress entity with the new values
        progress.setTotalTasks(totalTasks);
        progress.setTotalCompletedTasks(totalCompletedTasks);
        progress.setProgressPercentage(progressPercentage);

        // Save the updated progress entity
        progressRepository.save(progress);
    }

    // Method to get all progress entities
    public List<Progress> getAllProgress() {
        return progressRepository.findAll();
    }

    // Method to get tasks by progress ID
    public ResponseEntity<List<Task>> getTasksByProgressId(Long progressId) {
        // Find the progress entity
        Progress progress = progressRepository.findById(progressId)
                .orElseThrow(() -> new IllegalArgumentException("Progress not found with ID: " + progressId));

        // Get the list of tasks associated with this progress
        List<Task> tasks = taskRepository.findByProgressId(progress.getId());

        // If no tasks are found, return a No Content status
        if (tasks.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }

        // Calculate total tasks and completed tasks
        int totalTasks = tasks.size();
        int completedTasks = (int) tasks.stream().filter(Task::isCompleted).count();

        // Calculate progress percentage
        double progressPercentage = totalTasks > 0 ? (completedTasks * 100.0 / totalTasks) : 0;

        // Set the calculated values back into the progress object
        progress.setTotalTasks(totalTasks);
        progress.setTotalCompletedTasks(completedTasks);
        progress.setProgressPercentage(progressPercentage);

        // Update the progress entity in the database if the values have changed
        progressRepository.save(progress);

        // Return the tasks with progress information
        return new ResponseEntity<>(tasks, HttpStatus.OK);
    }

    @Transactional
    public void deleteTasksAndProgressIfEmpty(Long progressId) {
        // Fetch all tasks under the given progress ID
        List<Task> tasks = taskRepository.findByProgressId(progressId);

        // Delete all tasks associated with the progress
        taskRepository.deleteAll(tasks);

        // Check if there are any tasks left for the progress
        tasks = taskRepository.findByProgressId(progressId);

        // If no tasks are left, delete the progress as well
        if (tasks.isEmpty()) {
            Progress progress = progressRepository.findById(progressId)
                    .orElseThrow(() -> new IllegalArgumentException("Progress not found with ID: " + progressId));
            progressRepository.delete(progress);
        }

    }


    @Transactional
    public Progress getProgressByTaskId(Long taskId) {
        return progressRepository.findByTasksId(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Progress not found"));
    }
}
