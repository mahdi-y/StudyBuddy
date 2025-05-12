// com.studybuddy.userservice.controller.LoginController
package com.studybuddy.userservice.controller;

import com.studybuddy.userservice.config.JWTService;
import com.studybuddy.userservice.dto.*;
import com.studybuddy.userservice.repo.LoginRepository;
import com.studybuddy.userservice.service.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api")
public class LoginController {

	@Autowired
	private AuthenticationManager authenticationManager;

	@Autowired
	private JWTService jwtService;

	@Autowired
	private LoginService loginService;

	@Autowired
	private LoginRepository loginRepository;

	@PostMapping("/doLogin")
	public ResponseEntity<LoginResponse> doLogin(@RequestBody LoginRequest request) {
		LoginResponse response = new LoginResponse();
		Authentication authentication = authenticationManager
				.authenticate(new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
		if (authentication.isAuthenticated()) {
			User user = loginRepository.findByUsername(request.getUsername())
					.orElseThrow(() -> new RuntimeException("User not found"));
			response.setToken(jwtService.generateToken(request.getUsername(), user.getId(), user.getRole()));
		} else {
			throw new RuntimeException("Invalid credentials");
		}
		return new ResponseEntity<>(response, HttpStatus.CREATED);
	}

	@GetMapping("/dashboard")
	public ResponseEntity<DashboardResponse> dashboard() {
		DashboardResponse response = new DashboardResponse();
		response.setResponse("Success");
		System.out.println("Dashboard Response");
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	@PostMapping(value = "/doRegister", consumes = {"multipart/form-data"})
	public ResponseEntity<SignupResponse> doRegister(
			@RequestPart("request") SignupRequest request,
			@RequestPart(value = "profilePicture", required = false) MultipartFile profilePicture) {
		return new ResponseEntity<>(loginService.doRegister(request, profilePicture), HttpStatus.CREATED);
	}
}