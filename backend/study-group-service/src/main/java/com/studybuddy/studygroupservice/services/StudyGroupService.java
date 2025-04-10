package com.studybuddy.studygroupservice.services;

import com.studybuddy.studygroupservice.dto.StudyGroupDTO;
import com.studybuddy.studygroupservice.entities.StudyGroup;
import com.studybuddy.studygroupservice.repositories.StudyGroupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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
