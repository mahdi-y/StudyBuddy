package com.studybuddy.userservice.Repositories;

import com.studybuddy.userservice.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepositories extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);
}
