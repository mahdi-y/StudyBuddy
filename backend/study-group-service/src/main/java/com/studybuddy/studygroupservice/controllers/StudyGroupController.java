package com.studybuddy.studygroupservice.controllers;

import com.studybuddy.studygroupservice.dto.StudyGroupDTO;
import com.studybuddy.studygroupservice.entities.StudyGroup;
import com.studybuddy.studygroupservice.services.StudyGroupService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/groups")
@RequiredArgsConstructor
public class StudyGroupController {

    private final StudyGroupService studyGroupService;

    // Create a new study group
    @PostMapping
    public StudyGroupDTO createGroup(@RequestBody StudyGroupDTO studyGroupDTO) {
        // Create the study group using the service
        StudyGroup createdGroup = studyGroupService.createGroup(studyGroupDTO);
        return mapToStudyGroupDTO(createdGroup);
    }

    // Update an existing study group
    @PutMapping("/{id}")
    public StudyGroupDTO updateGroup(@PathVariable Long id, @RequestBody StudyGroupDTO studyGroupDTO) {
        // Ensure the group is updated with the provided details
        StudyGroup updatedStudyGroup = studyGroupService.updateGroup(id, studyGroupDTO);
        return mapToStudyGroupDTO(updatedStudyGroup);
    }

    // Delete a study group
    @DeleteMapping("/{id}")
    public void deleteGroup(@PathVariable Long id) {
        studyGroupService.deleteGroup(id);
    }

    // Convert StudyGroup entity to StudyGroupDTO
    private StudyGroupDTO mapToStudyGroupDTO(StudyGroup studyGroup) {
        StudyGroupDTO studyGroupDTO = new StudyGroupDTO();
        studyGroupDTO.setId(studyGroup.getId());
        studyGroupDTO.setName(studyGroup.getName());
        studyGroupDTO.setDescription(studyGroup.getDescription());
        studyGroupDTO.setOwnerUserId(studyGroup.getOwnerUserId());  // Include ownerUserId in DTO
        return studyGroupDTO;
    }
}
