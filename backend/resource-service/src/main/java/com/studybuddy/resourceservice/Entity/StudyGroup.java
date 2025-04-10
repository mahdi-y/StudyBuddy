package com.studybuddy.resourceservice.Entity;

import jakarta.persistence.*;

@Entity
public class StudyGroup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idGroup;

    public StudyGroup() {
    }

    public StudyGroup(Long idGroup) {
        this.idGroup = idGroup;
    }

    public Long getIdGroup() {
        return idGroup;
    }

    public void setIdGroup(Long idGroup) {
        this.idGroup = idGroup;
    }
}
