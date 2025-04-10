package com.studybuddy.userservice.Repositories;

import com.studybuddy.userservice.entities.UserPreferences;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserPreferencesRepositories extends JpaRepository<UserPreferences, Long> {

    Optional<UserPreferences> findByiduser(Long iduser);
}
