package com.studybuddy.taskservice.repository;

import com.studybuddy.taskservice.model.Progress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProgressRepository extends JpaRepository<Progress, Long> {
    Optional<Progress> findByTasksId(Long taskId);
    Optional<Progress> findByName(String name);
    List<Progress> findByArchived(boolean archived); // 👈 this is what you add

}

