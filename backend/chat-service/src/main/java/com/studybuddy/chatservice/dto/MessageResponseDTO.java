package com.studybuddy.chatservice.dto;

import com.studybuddy.chatservice.model.Message;

import java.time.LocalDateTime;

public class MessageResponseDTO {
    private Long id;
    private String content;
    private Long senderId;
    private LocalDateTime timestamp;
    private Long chatId;

    public MessageResponseDTO(Message message) {
        this.id = message.getId();
        this.content = message.getContent();
        this.senderId = message.getSenderId();
        this.timestamp = message.getTimestamp();
        this.chatId = message.getChat().getId();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Long getSenderId() {
        return senderId;
    }

    public void setSenderId(Long senderId) {
        this.senderId = senderId;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public Long getChatId() {
        return chatId;
    }

    public void setChatId(Long chatId) {
        this.chatId = chatId;
    }
}