package com.studybuddy.studygroupservice.dto;

import lombok.Data;

@Data
public class StudyGroupDTO {

    private Long id;
    private String name;
    private String description;
    private Long ownerUserId; // Add this field for ownerUserId

    // You no longer need a custom setter because @Data will auto-generate it
}
