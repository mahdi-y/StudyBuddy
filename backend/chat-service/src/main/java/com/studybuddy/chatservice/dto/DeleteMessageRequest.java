package com.studybuddy.chatservice.dto;

import lombok.Data;

@Data
public class DeleteMessageRequest {
    private Long messageId;
    private Long chatId;
}
