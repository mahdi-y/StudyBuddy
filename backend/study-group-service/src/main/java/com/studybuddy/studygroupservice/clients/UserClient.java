package com.studybuddy.studygroupservice.clients;

import com.studybuddy.studygroupservice.dto.UserDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class UserClient {

    private final RestTemplate restTemplate;

    public Long getUserIdByEmail(String email) {
        String url = "http://localhost:8080/api/users/email/" + email; // <--- Change port if needed
        UserDTO user = restTemplate.getForObject(url, UserDTO.class);

        if (user == null) {
            throw new RuntimeException("User not found with email: " + email);
        }

        return user.getId();
    }
}
