package com.studybuddy.userservice.service;


import com.studybuddy.userservice.dto.User;
import com.studybuddy.userservice.repo.LoginRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private LoginRepository loginRepository;

    public List<User> getAllUsers() {
        return loginRepository.findAll();
    }

    public User createUser(User user) {
        return loginRepository.save(user);
    }

    public User updateUser(int id, User user) {
        Optional<User> existingUser = loginRepository.findById(id);
        if (existingUser.isPresent()) {
            User updatedUser = existingUser.get();
            updatedUser.setName(user.getName());
            updatedUser.setUsername(user.getUsername());
            updatedUser.setPassword(user.getPassword());
            updatedUser.setAddress(user.getAddress());
            updatedUser.setMobileNo(user.getMobileNo());
            updatedUser.setAge(user.getAge());
            updatedUser.setRole(user.getRole());
            return loginRepository.save(updatedUser);
        }
        return null;
    }

    public void deleteUser(int id) {
        loginRepository.deleteById(id);
    }
}