package com.studybuddy.chatservice.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "chats")
public class Chat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "study_group_id", referencedColumnName = "id")
    @JsonBackReference
    private StudyGroup studyGroup;  // Link to StudyGroup

    @OneToMany(mappedBy = "chat", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Message> messages = new ArrayList<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public StudyGroup getStudyGroup() {
        return studyGroup;
    }

    public void setStudyGroup(StudyGroup studyGroup) {
        this.studyGroup = studyGroup;
    }


    public void setStudyGroupId(Long studyGroupId) {
        this.studyGroup.setId(studyGroupId);
    }
    public Long getStudyGroupId(Long studyGroupId) {
        return studyGroupId;
    }
}
