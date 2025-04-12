package com.studybuddy.chatservice.dto;

import lombok.Data;

@Data
public class MessageActionDTO {
    private Long messageId;
    private String action; // "DELETED" or "UPDATED"

    public MessageActionDTO(Long messageId, String action) {
        this.messageId = messageId;
        this.action = action;
    }
}