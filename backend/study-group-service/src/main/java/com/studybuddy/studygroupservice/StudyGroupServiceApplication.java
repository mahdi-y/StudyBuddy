package com.studybuddy.studygroupservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;


@SpringBootApplication
@EntityScan(basePackages = "com/studybuddy/studygroupservice/entities")
public class StudyGroupServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(StudyGroupServiceApplication.class, args);
    }
}