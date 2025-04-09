package com.studybuddy.userservice.controller;
import com.studybuddy.userservice.Services.UserPreferencesService;
import com.studybuddy.userservice.entities.UserPreferences;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user_preferences")
@CrossOrigin(origins = "*")
public class UserPreferencesController {



        @Autowired
        private UserPreferencesService userPreferencesService;

        @PostMapping
        public ResponseEntity<UserPreferences> save(@RequestBody UserPreferences prefs) {
            return ResponseEntity.ok(userPreferencesService.savePreferences(prefs));
        }

        @GetMapping("/user/{userId}")
        public ResponseEntity<UserPreferences> getByUserId(@PathVariable Long userId) {
            return userPreferencesService.getByUserId(userId)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        }

        @GetMapping
        public ResponseEntity<List<UserPreferences>> getAll() {
            return ResponseEntity.ok(userPreferencesService.getAll());
        }

        @DeleteMapping("/{idpreferences}")
        public ResponseEntity<Void> delete(@PathVariable Long idpreferences) {
            userPreferencesService.deleteById(idpreferences);
            return ResponseEntity.noContent().build();
        }
    }

