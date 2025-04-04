package com.studybuddy.chatservice.repository;

import com.studybuddy.chatservice.entity.Chat;
import com.studybuddy.chatservice.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ChatRepository extends JpaRepository<Chat, Long> {
//    Optional<Chat> findByUser1AndUser2(User user1, User user2);
}
