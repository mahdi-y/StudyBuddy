package com.studybuddy.studygroupservice.services;

import com.studybuddy.studygroupservice.dto.StudyGroupDTO;
import com.studybuddy.studygroupservice.entities.StudyGroup;
import com.studybuddy.studygroupservice.repositories.StudyGroupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StudyGroupService {

    private final StudyGroupRepository studyGroupRepository;

    // Create a new study group
    public StudyGroup createGroup(StudyGroupDTO studyGroupDTO) {
        StudyGroup studyGroup = new StudyGroup();
        studyGroup.setName(studyGroupDTO.getName());
        studyGroup.setDescription(studyGroupDTO.getDescription());
        studyGroup.setOwnerUserId(studyGroupDTO.getOwnerUserId());
        return studyGroupRepository.save(studyGroup);
    }
    public StudyGroup getGroupById(Long id) {
        return studyGroupRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Group not found"));
    }

    public List<StudyGroup> getAllGroups() {
        return studyGroupRepository.findAll();  // This will retrieve all study groups from the database
    }

    // Add this method to your StudyGroupService.java
    public List<StudyGroup> getUserGroups(Long userId) {
        return studyGroupRepository.findByOwnerUserId(userId);
    }


    // Update an existing study group
    public StudyGroup updateGroup(Long id, StudyGroupDTO studyGroupDTO) {
        StudyGroup studyGroup = studyGroupRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Study group not found"));

        studyGroup.setName(studyGroupDTO.getName());
        studyGroup.setDescription(studyGroupDTO.getDescription());
        studyGroup.setOwnerUserId(studyGroupDTO.getOwnerUserId());
        return studyGroupRepository.save(studyGroup);
    }


    // Delete a study group
    public void deleteGroup(Long id) {
        studyGroupRepository.deleteById(id);
    }
}
