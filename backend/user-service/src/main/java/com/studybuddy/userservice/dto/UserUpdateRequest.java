package com.studybuddy.userservice.dto;

import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
public class UserUpdateRequest {

    private String name;
    private String address;
    private String mobileNo;
    private Integer age;
}
