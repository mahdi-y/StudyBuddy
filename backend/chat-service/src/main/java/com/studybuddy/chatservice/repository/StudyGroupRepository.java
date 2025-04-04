package com.studybuddy.chatservice.repository;

import com.studybuddy.chatservice.entity.StudyGroup;
import com.studybuddy.chatservice.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StudyGroupRepository extends JpaRepository<StudyGroup, Long> {
    List<StudyGroup> findAllByUsersContaining(User user);
}
