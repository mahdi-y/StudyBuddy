package com.studybuddy.userservice.service;

import com.studybuddy.userservice.dto.User;
import com.studybuddy.userservice.dto.UserUpdateRequest;
import com.studybuddy.userservice.repo.LoginRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private LoginRepository loginRepository;



    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<User> getAllUsers() {
        return loginRepository.findAll();
    }

    public User createUser(User user) {
        return loginRepository.save(user);
    }
    public User updateUserByUsername(String username, UserUpdateRequest updateRequest) {
        User user = loginRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found with username " + username));
        if (updateRequest.getName() != null) user.setName(updateRequest.getName());
        if (updateRequest.getAddress() != null) user.setAddress(updateRequest.getAddress());
        if (updateRequest.getMobileNo() != null) user.setMobileNo(updateRequest.getMobileNo());
        if (updateRequest.getAge() != null) user.setAge(updateRequest.getAge());
        return loginRepository.save(user);
    }
    public User updateUser(Integer id, User userDetails) {
        User user = loginRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id " + id));
        user.setName(userDetails.getName());
        user.setUsername(userDetails.getUsername());
        user.setAddress(userDetails.getAddress());
        user.setMobileNo(userDetails.getMobileNo());
        user.setAge(userDetails.getAge());
        user.setRole(userDetails.getRole());
        user.setProfilePicture(userDetails.getProfilePicture());
        return loginRepository.save(user);
    }

    public void deleteUser(Integer id) {
        User user = loginRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id " + id));
        loginRepository.delete(user);
    }

    public Map<String, Object> getUserStatistics() {
        List<User> users = loginRepository.findAll();
        long totalAccounts = users.size();

        int[] ageRanges = {0, 18, 25, 35, 45, 55, 65, Integer.MAX_VALUE};
        String[] ageLabels = {"<18", "18-24", "25-34", "35-44", "45-54", "55-64", "65+"};
        int[] counts = new int[ageLabels.length];

        for (User user : users) {
            Integer age = user.getAge();
            if (age == null) continue;
            for (int i = 0; i < ageRanges.length - 1; i++) {
                if (age >= ageRanges[i] && age < ageRanges[i + 1]) {
                    counts[i]++;
                    break;
                }
            }
        }

        Map<String, Double> agePercentages = new HashMap<>();
        for (int i = 0; i < ageLabels.length; i++) {
            double percentage = totalAccounts > 0 ? (counts[i] * 100.0) / totalAccounts : 0.0;
            agePercentages.put(ageLabels[i], Math.round(percentage * 10.0) / 10.0);
        }

        Map<String, Object> statistics = new HashMap<>();
        statistics.put("totalAccounts", totalAccounts);
        statistics.put("agePercentages", agePercentages);

        return statistics;
    }



}