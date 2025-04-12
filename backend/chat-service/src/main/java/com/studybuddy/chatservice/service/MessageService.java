package com.studybuddy.chatservice.service;

import com.studybuddy.chatservice.model.Chat;
import com.studybuddy.chatservice.model.Message;
import com.studybuddy.chatservice.repository.ChatRepository;
import com.studybuddy.chatservice.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final ChatRepository chatRepository;
    private final MessageRepository messageRepository;

    public Message saveMessage(Long chatId, Long senderId, String content) {
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new RuntimeException("Chat not found"));

        Message message = Message.builder()
                .chat(chat)
                .senderId(senderId)
                .content(content)
                .timestamp(LocalDateTime.now())
                .build();

        return messageRepository.save(message);
    }

    public List<Message> getMessagesByChatId(Long chatId) {
        System.out.println("Fetching messages for chatId: " + chatId);
        List<Message> messages = messageRepository.findByChatId(chatId);
        System.out.println("Fetched " + messages.size() + " messages for chatId: " + chatId);
        return messages;
    }
}
