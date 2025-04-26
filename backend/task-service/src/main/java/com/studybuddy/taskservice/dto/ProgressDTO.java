package com.studybuddy.taskservice.dto;

import java.util.List;

public class ProgressDTO {

    private List<Long> taskIds;  // List of task IDs for multiple tasks
    private Integer progressPercentage;
    private Integer totalTasks;
    private Integer totalCompletedTasks;

    // Constructor
    public ProgressDTO(List<Long> taskIds, Integer progressPercentage, Integer totalTasks, Integer completedTasks) {
        this.taskIds = taskIds;
        this.progressPercentage = progressPercentage;
        this.totalTasks = totalTasks;
        this.totalCompletedTasks = completedTasks;
    }

    // Getters and Setters
    public List<Long> getTaskIds() {
        return taskIds;
    }

    public void setTaskIds(List<Long> taskIds) {
        this.taskIds = taskIds;
    }

    public Integer getProgressPercentage() {
        return progressPercentage;
    }

    public void setProgressPercentage(Integer progressPercentage) {
        this.progressPercentage = progressPercentage;
    }

    public Integer getTotalTasks() {
        return totalTasks;
    }

    public void setTotalTasks(Integer totalTasks) {
        this.totalTasks = totalTasks;
    }

    public Integer getTotalCompletedTasks() {
        return totalCompletedTasks;
    }

    public void setCompletedTasks(Integer completedTasks) {
        this.totalCompletedTasks = completedTasks;
    }
}
