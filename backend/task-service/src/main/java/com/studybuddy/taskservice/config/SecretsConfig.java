package com.studybuddy.taskservice.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

@Configuration
@PropertySource("classpath:task.properties")
public class SecretsConfig {
}