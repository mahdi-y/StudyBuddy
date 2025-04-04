package com.studybuddy.chatservice.service;

import com.studybuddy.chatservice.dto.MessageDTO;
import com.studybuddy.chatservice.entity.Chat;
import com.studybuddy.chatservice.entity.Message;
import com.studybuddy.chatservice.entity.User;
import com.studybuddy.chatservice.repository.ChatRepository;
import com.studybuddy.chatservice.repository.MessageRepository;
import com.studybuddy.chatservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final ChatRepository chatRepository;
    private final UserRepository userRepository;

    public MessageDTO sendMessage(Long userId, Long chatId, String content) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new IllegalArgumentException("Chat not found"));

        if (!chat.getStudyGroup().getUsers().contains(user)) {
            throw new IllegalArgumentException("User does not belong to this study group");
        }

        Message message = new Message();
        message.setUser(user);
        message.setChat(chat);
        message.setContent(content);
        message.setTimestamp(Timestamp.valueOf(LocalDateTime.now()));

        message = messageRepository.save(message);

        return new MessageDTO(message);
    }


    public List<MessageDTO> getChatMessages(Long chatId, Long userId) {
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new IllegalArgumentException("Chat not found"));

        boolean userHasAccess = chat.getStudyGroup().getUsers().stream()
                .anyMatch(user -> user.getId().equals(userId));

        if (!userHasAccess) {
            throw new IllegalArgumentException("User does not have access to this chat");
        }

        return messageRepository.findByChatOrderByTimestampAsc(chat).stream()
                .map(MessageDTO::new)
                .collect(Collectors.toList());
    }


}

