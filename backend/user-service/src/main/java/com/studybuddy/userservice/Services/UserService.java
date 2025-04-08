package com.studybuddy.userservice.Services;


import com.studybuddy.userservice.Repositories.UserRepositories;
import com.studybuddy.userservice.entities.user;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepositories userRepositories;

    public user saveUser(user user) {
        return userRepositories.save(user);
    }

    public Optional<user> getUserById(Integer id) {
        return userRepositories.findById(id);
    }

    public Optional<user> getUserByEmail(String email) {
        return userRepositories.findByEmail(email);
    }

    public List<user> getAllUsers() {
        return userRepositories.findAll();
    }

    public void deleteUser(Integer id) {
        userRepositories.deleteById(id);
    }
}
