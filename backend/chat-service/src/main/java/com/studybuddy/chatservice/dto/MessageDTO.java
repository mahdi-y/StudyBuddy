package com.studybuddy.chatservice.dto;

import com.studybuddy.chatservice.entity.Message;

import java.time.LocalDateTime;

public class MessageDTO {
    private String id;
    private String content;
    private LocalDateTime timestamp;
    private UserDTO user;

    public MessageDTO(Message message) {
        this.id = message.getId().toString();
        this.content = message.getContent();
        this.timestamp = message.getTimestamp().toLocalDateTime();
        this.user = new UserDTO(message.getUser());
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public UserDTO getUser() {
        return user;
    }

    public void setUser(UserDTO user) {
        this.user = user;
    }
}

