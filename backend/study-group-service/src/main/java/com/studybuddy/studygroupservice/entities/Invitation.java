package com.studybuddy.studygroupservice.entities;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "invitations")
@Data
public class    Invitation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String status; // PENDING, ACCEPTED, REJECTED
    private String type;   // GROUP_INVITE

    @Column(name = "inviter_user_id")
    private Long inviterUserId;

    @Column(name = "invitee_user_id")
    private Long inviteeUserId;

    private LocalDateTime createdAt = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "study_group_id")
    private StudyGroup studyGroup;
}
