package com.studybuddy.userservice.Repositories;

// src/main/java/com/studybuddy/user/repository/UserRepository.java


import com.studybuddy.userservice.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface UserRepositories extends JpaRepository<User, Integer> {

    Optional<User> findByuseremail(String useremail);

}
