package com.studybuddy.resourceservice.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.*;


@Entity
@Table(name = "app_user")  // Specify a custom table name
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idUser;

    // Constructors
    public User() {
    }

    public User(Long idUser) {
        this.idUser = idUser;
    }

    // Getter and Setter
    public Long getIdUser() {
        return idUser;
    }

    public void setIdUser(Long idUser) {
        this.idUser = idUser;
    }
}