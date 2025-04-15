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

    private String preferredstudytopics;

    private Boolean notificationsenabled;
    @Column(name = "darkmode")

    private boolean darkmode;

    private String language;

    private int iduser;
}

