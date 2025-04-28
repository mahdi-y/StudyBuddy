package com.studybuddy.resourceservice;

import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

public class WebConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:4200") // Frontend URL
                        .allowedHeaders("Study-Group-ID", "Content-Type")
                        .allowedMethods("GET", "POST", "PUT", "DELETE");
            }
        };
    }
}
