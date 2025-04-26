package com.studybuddy.taskservice.repository;

import com.studybuddy.taskservice.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByProgressId(Long progressId);  // This is correct as Progress is a field in Task
    boolean existsByProgressId(Long progressId);

}
