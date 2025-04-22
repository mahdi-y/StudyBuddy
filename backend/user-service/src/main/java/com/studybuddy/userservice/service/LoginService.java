package com.studybuddy.userservice.service;

import java.util.Optional;

import com.studybuddy.userservice.dto.LoginRequest;
import com.studybuddy.userservice.dto.SignupRequest;
import com.studybuddy.userservice.dto.SignupResponse;
import com.studybuddy.userservice.dto.User;
import com.studybuddy.userservice.repo.LoginRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;



@Service
public class LoginService {

	@Autowired
	private LoginRepository loginRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	public String doLogin(LoginRequest request) {
		Optional<User> users = loginRepository.findByUsername(request.getUsername());

		if (users.isPresent()) {
			return "User details found";
		}

		return "User details not found";
	}

	public SignupResponse doRegister(SignupRequest request) {
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
		user.setAge(request.getAge() != null ? Integer.parseInt(request.getAge()) : null); // Handle string to integer
		user.setRole("USER"); // Default to USER role

		loginRepository.save(user);

		response.setResponse("User created with id " + user.getId());

		return response;
	}
}
