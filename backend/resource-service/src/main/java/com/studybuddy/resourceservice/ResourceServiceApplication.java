package com.studybuddy.resourceservice;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@SpringBootApplication
public class ResourceServiceApplication implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(ResourceServiceApplication.class);

    @Autowired
    private DataSource dataSource;

    public static void main(String[] args) {
        SpringApplication.run(ResourceServiceApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        try (Connection connection = dataSource.getConnection()) {
            if (connection != null && !connection.isClosed()) {
                logger.info("Database connected successfully!");
            } else {
                logger.error("Failed to connect to the database.");
            }
        } catch (SQLException e) {
            logger.error("Database connection failed: {}", e.getMessage());
        }
    }
}
