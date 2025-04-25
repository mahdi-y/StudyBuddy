package com.studybuddy.chatservice.dto;

public class TypingIndicatorDTO {
    private Long chatId;
    private Long senderId;
    private boolean typing; // <--- Add this

    // getters and setters
    public Long getChatId() { return chatId; }
    public void setChatId(Long chatId) { this.chatId = chatId; }

    public Long getSenderId() { return senderId; }
    public void setSenderId(Long senderId) { this.senderId = senderId; }

    public boolean isTyping() { return typing; }
    public void setTyping(boolean typing) { this.typing = typing; }
}

