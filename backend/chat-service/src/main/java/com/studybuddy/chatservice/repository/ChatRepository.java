package com.studybuddy.chatservice.repository;

import com.studybuddy.chatservice.model.Chat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ChatRepository extends JpaRepository<Chat, Long> {
    @Query("SELECT c.id FROM Chat c WHERE c.studyGroupId = :studyGroupId")
    Optional<Long> findChatIdByStudyGroupId(@Param("studyGroupId") Long studyGroupId);
}
