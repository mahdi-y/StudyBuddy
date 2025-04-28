package com.studybuddy.userservice.repo;

import java.util.Optional;

import com.studybuddy.userservice.dto.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;



@Repository
public interface LoginRepository extends JpaRepository<User, Integer> {

    Optional<User> findByUsername(String username);   // Assuming 'username' exists in User entity
    boolean existsByAddress(String address);          // Check if address exists
    Optional<User> findByAddress(String address);
}
