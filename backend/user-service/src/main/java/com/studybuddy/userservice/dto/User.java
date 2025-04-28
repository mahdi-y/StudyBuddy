// com.studybuddy.userservice.dto.User
package com.studybuddy.userservice.dto;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "users")
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(nullable = false)
	private String name;

	@Column(unique = true)
	private String address;

	private String mobileNo;

	@Column(unique = true)
	private String username;

	private String password;

	private Integer age;

	private String role;

	private String profilePicture; // New field for profile picture URL or path
	private String resetCode;
	private Long resetCodeExpiry;
}