package com.studybuddy.userservice.controller;

import com.studybuddy.userservice.dto.User;
import com.studybuddy.userservice.dto.UserUpdateRequest;
import com.studybuddy.userservice.repo.LoginRepository;
import com.studybuddy.userservice.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://192.168.1.56:30080") // Angular port
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;
    @Autowired
    private LoginRepository loginRepository;
    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.createUser(user);
    }
    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();
        User user = loginRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(user);
    }
    @PutMapping("/me")
    public ResponseEntity<User> updateCurrentUser(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody UserUpdateRequest updateRequest) {

        String username = userDetails.getUsername();
        User updatedUser = userService.updateUserByUsername(username, updateRequest);
        return ResponseEntity.ok(updatedUser);
    }
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Integer id, @RequestBody User userDetails) {
        User updatedUser = userService.updateUser(id, userDetails);
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
    public ResponseEntity<Void> deleteUser(@PathVariable Integer id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }


    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getUserStatistics() {
        Map<String, Object> statistics = userService.getUserStatistics();
        return ResponseEntity.ok(statistics);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable int id) {
        Optional<User> user = userService.getUserById(id);
        return user.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

}