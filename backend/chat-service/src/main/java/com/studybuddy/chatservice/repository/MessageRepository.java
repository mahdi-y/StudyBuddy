package com.studybuddy.chatservice.repository;

import com.studybuddy.chatservice.entity.Chat;
import com.studybuddy.chatservice.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByChatOrderByTimestampAsc(Chat chat);
}