package com.studybuddy.userservice.Services;


import com.studybuddy.userservice.Repositories.UserRepositories;
import com.studybuddy.userservice.entities.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepositories userRepositories;

    public User saveUser(User user) {
        return userRepositories.save(user);
    }

    public Optional<User> getUserById(Integer id) {
        return userRepositories.findById(id);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepositories.findByEmail(email);
    }

    public List<User> getAllUsers() {
        return userRepositories.findAll();
    }

    public void deleteUser(Integer id) {
        userRepositories.deleteById(id);
    }
}
