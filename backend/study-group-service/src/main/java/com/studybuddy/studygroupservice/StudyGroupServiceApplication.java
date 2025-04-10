package com.studybuddy.studygroupservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;

@ComponentScan(basePackages = "com.studybuddy.studygroupservice") // Ensure controllers and services are scanned

@SpringBootApplication
@EntityScan(basePackages = "com/studybuddy/studygroupservice/entities")
public class StudyGroupServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(StudyGroupServiceApplication.class, args);
    }
}