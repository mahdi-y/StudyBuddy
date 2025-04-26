package com.studybuddy.studygroupservice.dto;

import lombok.Data;

@Data
public class UserDTO {
    private Long id;
    private String name;
    private String username;
    private String address;
    private String mobileNo;
    private Integer age;
    private String role;
}
