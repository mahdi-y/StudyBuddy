package com.studybuddy.chatservice.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

@Configuration
@PropertySource("classpath:chat.properties")
public class SecretsConfig {
}