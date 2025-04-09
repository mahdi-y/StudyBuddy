

package com.studybuddy.userservice.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int iduser;

    private String profile_picture;

    @Column(nullable = false, unique = true)
    private String useremail;

    private String username;

    @Column(nullable = false)
    private String password;

    private String role;
}
