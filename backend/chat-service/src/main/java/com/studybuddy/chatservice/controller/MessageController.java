package com.studybuddy.chatservice.controller;

import com.studybuddy.chatservice.dto.MessageDTO;
import com.studybuddy.chatservice.dto.MessageResponseDTO;
import com.studybuddy.chatservice.model.Message;
import com.studybuddy.chatservice.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/messages")
public class MessageController {

    private final MessageService messageService;
    private final SimpMessagingTemplate messagingTemplate;

    @GetMapping("/{chatId}")
    public List<Message> getMessages(@PathVariable Long chatId) {
        return messageService.getMessagesByChatId(chatId);
    }

    @PostMapping("/send-message")
    public Message createMessage(@RequestBody MessageDTO messageDTO) {
        Message savedMessage = messageService.saveMessage(
                messageDTO.getChatId(),
                messageDTO.getSenderId(),
                messageDTO.getContent()
        );

        return savedMessage;
    }

    @MessageMapping("/sendMessage")
    public void sendMessage(MessageDTO messageDTO, @Header("receipt") String receiptId) {
        // Save the message
        Message savedMessage = messageService.saveMessage(
                messageDTO.getChatId(),
                messageDTO.getSenderId(),
                messageDTO.getContent()
        );

        MessageResponseDTO response = new MessageResponseDTO(savedMessage);

        messagingTemplate.convertAndSend("/topic/chats/" + messageDTO.getChatId(), response);
    }

}
