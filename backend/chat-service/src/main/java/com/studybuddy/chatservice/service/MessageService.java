package com.studybuddy.chatservice.service;

import com.studybuddy.chatservice.model.Chat;
import com.studybuddy.chatservice.model.Message;
import com.studybuddy.chatservice.repository.ChatRepository;
import com.studybuddy.chatservice.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final ChatRepository chatRepository;
    private final MessageRepository messageRepository;

    @Autowired
    private ToxicityDetectionService toxicityDetectionService;

    public Message saveMessage(Long chatId, Long senderId, String content) {
        // Split the message into words
        String[] words = content.split("\\s+");
        StringBuilder cleanedMessage = new StringBuilder();

        // Check each word for toxicity
        for (String word : words) {
            double toxicityScore = toxicityDetectionService.getToxicityScore(word);

            // If toxic, replace the word with asterisks
            if (toxicityScore >= 0.5) {
                cleanedMessage.append("*".repeat(word.length())).append(" ");
            } else {
                cleanedMessage.append(word).append(" ");
            }
        }

        // Build the final message
        String finalMessage = cleanedMessage.toString().trim();

        // Save the message
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new RuntimeException("Chat not found"));

        Message message = Message.builder()
                .chat(chat)
                .senderId(senderId)
                .content(finalMessage)
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
