package com.studybuddy.userservice.controller;

import com.studybuddy.userservice.Services.UserService;
import com.studybuddy.userservice.entities.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")

public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        return ResponseEntity.ok(userService.saveUser(user));
    }

    @GetMapping("/{iduser}")
    public ResponseEntity<User> getUser(@PathVariable int iduser) {
        return userService.getUserById(iduser)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @DeleteMapping("/{iduser}")
    public ResponseEntity<Void> deleteUser(@PathVariable int iduser) {
        userService.deleteUser(iduser);
        return ResponseEntity.noContent().build();
    }

}
