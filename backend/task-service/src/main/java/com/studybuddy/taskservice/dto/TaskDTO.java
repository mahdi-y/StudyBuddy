package com.studybuddy.taskservice.dto;

import java.time.LocalDateTime;

public class TaskDTO {
    private Long id;

    private String title;
    private String description;
    private LocalDateTime dueDate;
    private boolean isCompleted;
    private LocalDateTime createdAt; // Add the createdAt field

    private Long progressId; // This will link the task to a specific progress
    private String ProgressName;

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
    public String getProgressName() {return ProgressName;}
    public void setProgressName(String ProgressName) {this.ProgressName =ProgressName;}

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDateTime dueDate) {
        this.dueDate = dueDate;
    }

    public boolean isCompleted() {
        return isCompleted;
    }

    public void setCompleted(boolean completed) {
        isCompleted = completed;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Long getProgressId() {
        return progressId;
    }

    public void setProgressId(Long progressId) {
        this.progressId = progressId;
    }
}
