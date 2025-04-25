package com.studybuddy.userservice.config;

import java.util.Optional;

import com.studybuddy.userservice.dto.User;
import com.studybuddy.userservice.repo.LoginRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;





@Component
public class UserInfoUserDetailsService implements UserDetailsService {

	@Autowired
	private LoginRepository repository;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		Optional<User> userInfo = repository.findByUsername(username);

		return userInfo.map(UserInfoUserDetails::new)
				.orElseThrow(() -> new UsernameNotFoundException("user not found " + username));
	}
}