package com.studybuddy.userservice.controller;


import com.studybuddy.userservice.dto.User;
import com.studybuddy.userservice.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        User createdUser = userService.createUser(user);
        return ResponseEntity.ok(createdUser);
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable int id, @RequestBody User user) {
        User updatedUser = userService.updateUser(id, user);
        if (updatedUser == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedUser);
    }
    @GetMapping("/user-id/{address}")
    public ResponseEntity<Integer> getUserIdByEmail(@PathVariable String address) {
        int userId = userService.getUserIdByEmail(address);  // Now using 'int' instead of 'Long'
        if (userId == 0) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(userId);
    }




    // New endpoint to check if an email exists
    @GetMapping("/check-address")
    public ResponseEntity<Boolean> checkAddressExists(@RequestParam String address) {
        boolean exists = userService.checkEmailExists(address);
        return ResponseEntity.ok(exists);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable int id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable int id) {
        Optional<User> user = userService.getUserById(id);
        return user.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

}