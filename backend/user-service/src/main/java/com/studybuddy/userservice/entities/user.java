package com.studybuddy.userservice.entities;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Table(name = "user")
public class user {
    @Id
    @Column(name = "user_id")
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int userid;

    @Column(name = "user_name")
    private String username;

    @Column(name = "user_email")
    private String useremail;

    @Column(name = "password", length = 12)
    private int password;
    @Column(name = "profile_picture")
    private String profilepicture;
    @Column(name = "role")
    private String role;


    public user(int userid, String username, String useremail, String profilepicture,String role,int password) {
        this.userid = userid;
        this.username = username;
        this.useremail = useremail;
        this.profilepicture = profilepicture;
        this.role = role;
        this.password = password;
    }

    public user() {
    }

    public user(String username, String useremail, int password, String role) {
        this.username = username;
        this.useremail = useremail;
        this.password = password;
        this.role = role;
    }

}

