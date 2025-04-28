// com.studybuddy.userservice.service.LoginService
package com.studybuddy.userservice.service;

import com.studybuddy.userservice.dto.SignupRequest;
import com.studybuddy.userservice.dto.SignupResponse;
import com.studybuddy.userservice.dto.User;
import com.studybuddy.userservice.repo.LoginRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

@Service
public class LoginService {

	@Autowired
	private LoginRepository loginRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private FileStorageService fileStorageService;

	public SignupResponse doRegister(SignupRequest request, MultipartFile profilePicture) {
		Optional<User> users = loginRepository.findByUsername(request.getUsername());
		SignupResponse response = new SignupResponse();

		if (users.isPresent()) {
			response.setResponse("User details Already found");
			return response;
		}

		User user = new User();
		user.setAddress(request.getAddress());
		user.setMobileNo(request.getMobileno());
		user.setName(request.getName());
		user.setUsername(request.getUsername());
		user.setPassword(passwordEncoder.encode(request.getPassword()));
		user.setAge(request.getAge() != null ? Integer.parseInt(request.getAge()) : null);
		user.setRole("USER");

		// Handle profile picture
		try {
			if (profilePicture != null && !profilePicture.isEmpty()) {
				// Store uploaded file
				String filePath = fileStorageService.storeFile(profilePicture);
				user.setProfilePicture(filePath);
			} else {
				// Use DiceBear API for AI-generated avatar
				String avatarUrl = "https://api.dicebear.com/9.x/avataaars/svg?seed=" + request.getUsername();
				user.setProfilePicture(avatarUrl);
			}
		} catch (Exception e) {
			response.setResponse("Error processing profile picture: " + e.getMessage());
			return response;
		}

		loginRepository.save(user);
		response.setResponse("User created with id " + user.getId());
		return response;
	}
}