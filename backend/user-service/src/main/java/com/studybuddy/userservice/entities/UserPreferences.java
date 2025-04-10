package com.studybuddy.userservice.entities;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_preferences")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserPreferences {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idpreferences;

    private String preferredStudyTopics;

    private Boolean notificationsEnabled;
    @Column(name = "DarkMode")

    private boolean DarkMode;

    private String language;

    private Long iduser;
}

