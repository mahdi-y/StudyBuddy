package com.studybuddy.userservice.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity  // Add this annotation
@Table(name = "users")
@Getter
@Setter
@ToString
public class User {
    @Id
    @Column(name = "iduser")
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int userid;

    @Column(name = "username")
    private String username;

    @Column(name = "useremail")
    private String useremail;

    @Column(name = "password", length = 12)
    private int password;

    @Column(name = "profile_picture")
    private String profilepicture;

    @Column(name = "role")
    private String role;

    public User(int userid, String username, String useremail, String profilepicture, String role, int password) {
        this.userid = userid;
        this.username = username;
        this.useremail = useremail;
        this.profilepicture = profilepicture;
        this.role = role;
        this.password = password;
    }

    public User() {
    }

    public User(String username, String useremail, int password, String role) {
        this.username = username;
        this.useremail = useremail;
        this.password = password;
        this.role = role;
    }
}