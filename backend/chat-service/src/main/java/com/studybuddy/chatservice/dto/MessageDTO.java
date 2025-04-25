package com.studybuddy.chatservice.dto;

import lombok.Data;

@Data
public class MessageDTO {
    private Long Id;
    private Long chatId;
    private Long senderId;
    private String content;

}
