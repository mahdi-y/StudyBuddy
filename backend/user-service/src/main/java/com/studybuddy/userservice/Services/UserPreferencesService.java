package com.studybuddy.userservice.Services;
import com.studybuddy.userservice.Repositories.UserPreferencesRepositories;
import com.studybuddy.userservice.entities.UserPreferences;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserPreferencesService {

    @Autowired
    private UserPreferencesRepositories userpreferencesRepositories;

    public UserPreferences savePreferences(UserPreferences prefs) {
        return userpreferencesRepositories.save(prefs);
    }

    public Optional<UserPreferences> getByIdUser(int iduser) {
        return userpreferencesRepositories.findByiduser(iduser);
    }

    public List<UserPreferences> getAll() {
        return userpreferencesRepositories.findAll();
    }

    public void deleteById(int idpreferences) {
        userpreferencesRepositories.deleteById(idpreferences);
    }
}

