
package com.studybuddy.taskservice.service;
import com.studybuddy.taskservice.model.Task;
import com.studybuddy.taskservice.model.Progress;
import com.studybuddy.taskservice.repository.TaskRepository;
import com.studybuddy.taskservice.repository.ProgressRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
@Service
public class ProgressService {

    @Autowired
    private ProgressRepository ProgressRepository;

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
        ProgressRepository.save(progress);
    }
    @Transactional
    public Progress getProgressByTaskId(Long taskId) {
        return ProgressRepository.findByTasksId(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Progress not found"));
    }
}

