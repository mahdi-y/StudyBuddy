package com.studybuddy.taskservice.repository;

import com.studybuddy.taskservice.model.Progress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProgressRepository extends JpaRepository<Progress, Long> {
    // ✅ Corrected method name
    Optional<Progress> findByTasksId(Long taskId);
}
