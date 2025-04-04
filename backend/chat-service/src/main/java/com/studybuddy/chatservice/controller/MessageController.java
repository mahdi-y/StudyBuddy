package com.studybuddy.chatservice.controller;

import com.studybuddy.chatservice.dto.MessageDTO;
import com.studybuddy.chatservice.dto.SendMessageRequest;
import com.studybuddy.chatservice.entity.Message;
import com.studybuddy.chatservice.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @PostMapping("/send/{chatId}")
    public ResponseEntity<MessageDTO> sendMessage(@PathVariable Long chatId, @RequestBody SendMessageRequest messageRequest) {
        MessageDTO messageDTO = messageService.sendMessage(
                messageRequest.getUserId(), chatId, messageRequest.getContent());
        return ResponseEntity.status(HttpStatus.CREATED).body(messageDTO);
    }

    @GetMapping("/{chatId}/user/{userId}")
    public ResponseEntity<List<MessageDTO>> getMessages(
            @PathVariable Long chatId,
            @PathVariable Long userId
    ) {
        List<MessageDTO> messages = messageService.getChatMessages(chatId, userId);
        return ResponseEntity.ok(messages);
    }

}
