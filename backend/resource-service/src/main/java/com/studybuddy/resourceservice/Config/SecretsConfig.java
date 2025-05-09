package com.studybuddy.resourceservice.Config;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

@Configuration
@PropertySource("classpath:resource.properties")
public class SecretsConfig {
}