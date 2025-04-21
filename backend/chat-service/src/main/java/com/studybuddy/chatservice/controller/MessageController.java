package com.studybuddy.chatservice.controller;

import com.studybuddy.chatservice.dto.*;
import com.studybuddy.chatservice.model.Message;
import com.studybuddy.chatservice.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
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

    @MessageMapping("/deleteMessage")
    public void deleteMessage(@Payload DeleteMessageRequest request) {
        messageService.deleteMessage(request.getMessageId());
        messagingTemplate.convertAndSend("/topic/chats/" + request.getChatId(),
                new MessageActionDTO(request.getMessageId(), "DELETED"));
    }

    @MessageMapping("/updateMessage")
    public void updateMessage(@Payload UpdateMessageRequest request) {
        Message updatedMessage = messageService.updateMessage(
                request.getMessageId(),
                request.getNewContent()
        );
        messagingTemplate.convertAndSend("/topic/chats/" + request.getChatId(),
                new MessageResponseDTO(updatedMessage));
    }

    @MessageMapping("/typingIndicator")
    public void handleTypingIndicator(TypingIndicatorDTO typingIndicator) {
        System.out.println("Received typing indicator: " + typingIndicator);

        messagingTemplate.convertAndSend(
                "/topic/chats/" + typingIndicator.getChatId(),
                new TypingIndicatorResponse(typingIndicator.getSenderId(), typingIndicator.isTyping())
        );

        System.out.println("Broadcasted typing indicator for chatId: " + typingIndicator.getChatId());
    }



}
