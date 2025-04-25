package com.studybuddy.chatservice.dto;

import lombok.Data;

@Data
public class UpdateMessageRequest {
    private Long messageId;
    private Long chatId;
    private String newContent;
}
