package com.studybuddy.chatservice.dto;

public class ChatSettingsDTO {
    private boolean profanityFilterEnabled;

    // Constructors
    public ChatSettingsDTO() {}

    public ChatSettingsDTO(boolean profanityFilterEnabled) {
        this.profanityFilterEnabled = profanityFilterEnabled;
    }

    // Getters and setters
    public boolean isProfanityFilterEnabled() {
        return profanityFilterEnabled;
    }

    public void setProfanityFilterEnabled(boolean profanityFilterEnabled) {
        this.profanityFilterEnabled = profanityFilterEnabled;
    }
}