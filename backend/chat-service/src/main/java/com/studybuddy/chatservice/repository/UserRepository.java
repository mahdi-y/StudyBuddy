package com.studybuddy.chatservice.repository;

import com.studybuddy.chatservice.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}
