package com.studybuddy.userservice.Repositories;

import com.studybuddy.userservice.entities.user;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepositories extends JpaRepository<user, Integer> {
    Optional<user> findByEmail(String email);
}
