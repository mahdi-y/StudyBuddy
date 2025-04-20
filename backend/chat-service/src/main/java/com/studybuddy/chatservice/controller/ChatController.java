package com.studybuddy.chatservice.controller;

import com.studybuddy.chatservice.dto.ChatSettingsDTO;
import com.studybuddy.chatservice.model.Chat;
import com.studybuddy.chatservice.repository.ChatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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
                .profanityFilterEnabled(true)
                .build();
        return chatRepository.save(chat);
    }

    @GetMapping("/{chatId}/settings")
    public ResponseEntity<ChatSettingsDTO> getChatSettings(@PathVariable Long chatId) {
        return chatRepository.findById(chatId)
                .map(chat -> ResponseEntity.ok(new ChatSettingsDTO(chat.isProfanityFilterEnabled())))
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{chatId}/settings")
    public ResponseEntity<Object> updateChatSettings(
            @PathVariable Long chatId,
            @RequestBody ChatSettingsDTO settings) {

        System.out.println("Updating chat settings for chatId: " + chatId);
        System.out.println("New profanityFilterEnabled: " + settings.isProfanityFilterEnabled());

        return chatRepository.findById(chatId)
                .map(chat -> {
                    chat.setProfanityFilterEnabled(settings.isProfanityFilterEnabled());
                    chatRepository.save(chat);
                    System.out.println("Updated chat settings successfully");
                    return ResponseEntity.ok().build();
                })
                .orElseGet(() -> {
                    System.out.println("Chat not found for chatId: " + chatId);
                    return ResponseEntity.notFound().build();
                });
    }
}
