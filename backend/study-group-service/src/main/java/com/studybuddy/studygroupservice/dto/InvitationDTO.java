package com.studybuddy.studygroupservice.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class InvitationDTO {
    private Long id;
    private String status;
    private String type;
    private Long inviterUserId;
    private Long inviteeUserId; // This field should be included
    private String inviteeEmail; // This field should be included, if used
    private LocalDateTime createdAt;
    private StudyGroupDTO studyGroup;

    // Getters and setters
}

