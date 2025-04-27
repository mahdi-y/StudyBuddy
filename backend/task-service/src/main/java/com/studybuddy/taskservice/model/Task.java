package com.studybuddy.taskservice.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tasks") // Map the entity to the "tasks" table
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private LocalDateTime dueDate;
    private boolean isCompleted;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // Foreign key for the user who created the task
    @Column(name = "created_by", nullable = false)
    private Long createdBy; // ID of the user who created the task

    // Foreign key for the user to whom the task is assigned
    @Column(name = "assigned_to", nullable = true)
    private Long assignedTo; // ID of the user to whom the task is assigned (nullable)

    // Many-to-One relationship with Progress
    @ManyToOne
    @JoinColumn(name = "progress_id", nullable = false)
    @JsonBackReference
    private Progress progress;

    // Set the createdAt timestamp before persisting the entity
    @PrePersist
    public void onPrePersist() {
        this.createdAt = LocalDateTime.now();
    }

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

    public Progress getProgress() {
        return progress;
    }

    public void setProgress(Progress progress) {
        this.progress = progress;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }


    public Long getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(Long createdBy) {
        this.createdBy = createdBy;
    }

    public Long getAssignedTo() {
        return assignedTo;
    }

    public void setAssignedTo(Long assignedTo) {
        this.assignedTo = assignedTo;
    }
}
