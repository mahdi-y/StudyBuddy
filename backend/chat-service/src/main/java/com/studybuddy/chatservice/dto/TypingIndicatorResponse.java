package com.studybuddy.chatservice.dto;

public class TypingIndicatorResponse {
    private Long senderId;
    private boolean isTyping;

    public TypingIndicatorResponse(Long senderId, boolean isTyping) {
        this.senderId = senderId;
        this.isTyping = isTyping;
    }

    public Long getSenderId() {
        return senderId;
    }

    public void setSenderId(Long senderId) {
        this.senderId = senderId;
    }

    public boolean isTyping() {
        return isTyping;
    }

    public void setTyping(boolean typing) {
        isTyping = typing;
    }
}
