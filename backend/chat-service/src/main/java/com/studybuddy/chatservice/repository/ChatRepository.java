package com.studybuddy.chatservice.repository;

import com.studybuddy.chatservice.model.Chat;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatRepository extends JpaRepository<Chat, Long> {
}
