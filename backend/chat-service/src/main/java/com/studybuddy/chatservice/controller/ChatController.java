package com.studybuddy.chatservice.controller;

import com.studybuddy.chatservice.model.Chat;
import com.studybuddy.chatservice.repository.ChatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chats")
@RequiredArgsConstructor
public class ChatController {

    private final ChatRepository chatRepository;

    @PostMapping
    public Chat createChat(@RequestParam Long studyGroupId) {
        Chat chat = Chat.builder()
                .studyGroupId(studyGroupId)
                .build();
        return chatRepository.save(chat);
    }
}
