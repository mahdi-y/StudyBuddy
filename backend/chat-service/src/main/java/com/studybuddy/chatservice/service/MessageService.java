package com.studybuddy.chatservice.service;

import com.studybuddy.chatservice.dto.ChatSettingsDTO;
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
    private final ToxicityDetectionService toxicityDetectionService;

    public Message saveMessage(Long chatId, Long senderId, String content) {
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new RuntimeException("Chat not found"));

        String filteredContent = chat.isProfanityFilterEnabled() ?
                toxicityDetectionService.filterMessage(content) :
                content;

        Message message = Message.builder()
                .chat(chat)
                .senderId(senderId)
                .content(filteredContent)
                .timestamp(LocalDateTime.now())
                .build();

        return messageRepository.save(message);
    }

    public ChatSettingsDTO getChatSettings(Long chatId) {
        return chatRepository.findById(chatId)
                .map(chat -> new ChatSettingsDTO(chat.isProfanityFilterEnabled()))
                .orElseThrow(() -> new RuntimeException("Chat not found"));
    }

    public void updateChatSettings(Long chatId, ChatSettingsDTO settings) {
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new RuntimeException("Chat not found"));
        chat.setProfanityFilterEnabled(settings.isProfanityFilterEnabled());
        chatRepository.save(chat);
    }

    public List<Message> getMessagesByChatId(Long chatId) {
        System.out.println("Fetching messages for chatId: " + chatId);
        List<Message> messages = messageRepository.findByChatId(chatId);
        System.out.println("Fetched " + messages.size() + " messages for chatId: " + chatId);
        return messages;
    }

    public void deleteMessage(Long messageId) {
        messageRepository.deleteById(messageId);
    }

    public Message updateMessage(Long messageId, String newContent) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));
        message.setContent(newContent);
        return messageRepository.save(message);
    }
}
