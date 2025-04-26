package com.studybuddy.taskservice.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "progress") // Map the entity to the "tasks" table
public class Progress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(mappedBy = "progress", cascade = CascadeType.ALL)
    @JsonBackReference
    private List<Task> tasks;  // Multiple tasks related to a progress

    @Column
    private double progressPercentage;
    private Integer totalTasks;
    private Integer totalCompletedTasks;
    @Column(nullable = true)
    private boolean archived = false; // 👈 this is what you add

    @Column(unique = true)
    private String name; // Add this field to represent the name of the progress

    private Long studyGroupId;


    // Getters and Setters

    public boolean isArchived() {
        return archived;
    }

    public void setArchived(boolean archived) {
        this.archived = archived;
    }

    public String getName() {
        return name;
    }

   public void setName(String name) {
       this.name = name;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public List<Task> getTasks() {
        return tasks;
    }

    public void setTasks(List<Task> tasks) {
        this.tasks = tasks;
    }

    public double getProgressPercentage() {
        return progressPercentage;
    }

    public void setProgressPercentage(double progressPercentage) {
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

    public void setTotalCompletedTasks(Integer completedTasks) {
        this.totalCompletedTasks = completedTasks;
    }

    public Long getStudyGroupId() {
        return studyGroupId;
    }

    public void setStudyGroupId(Long studyGroupId) {
        this.studyGroupId = studyGroupId;
    }
}
