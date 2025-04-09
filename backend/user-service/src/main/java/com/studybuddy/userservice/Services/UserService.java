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

    public Optional<User> getUserById(int userid) {
        return userRepositories.findById(userid);
    }

    public Optional<User> getUserByEmail(String useremail) {
        return userRepositories.findByuseremail(useremail);
    }

    public List<User> getAllUsers() {
        return userRepositories.findAll();
    }

    public void deleteUser(int userid) {
        userRepositories.deleteById(userid);
    }
}
