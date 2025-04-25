package com.studybuddy.studygroupservice.services;

import com.studybuddy.studygroupservice.dto.StudyGroupDTO;
import com.studybuddy.studygroupservice.entities.Invitation;
import com.studybuddy.studygroupservice.entities.StudyGroup;
import com.studybuddy.studygroupservice.repositories.InvitationRepository;
import com.studybuddy.studygroupservice.repositories.StudyGroupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Value;


import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudyGroupService {

    private final StudyGroupRepository studyGroupRepository;
    private final InvitationRepository invitationRepository;
    private final RestTemplate restTemplate;

    @Value("${chat-service.url}")
    private String chatServiceUrl;

    public StudyGroup createGroup(StudyGroupDTO studyGroupDTO) {
        StudyGroup studyGroup = new StudyGroup();
        studyGroup.setName(studyGroupDTO.getName());
        studyGroup.setDescription(studyGroupDTO.getDescription());
        studyGroup.setOwnerUserId(studyGroupDTO.getOwnerUserId());

        StudyGroup savedGroup = studyGroupRepository.save(studyGroup);

        try {
            restTemplate.postForObject(
                    chatServiceUrl + "?studyGroupId=" + savedGroup.getId(),
                    null,
                    Void.class
            );
        } catch (Exception e) {
            System.err.println("Error creating chat for group: " + e.getMessage());
        }

        return savedGroup;
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

    @Transactional
    public List<StudyGroup> getGroupsWhereUserIsInvited(Long userId) {
        List<Invitation> invitations = invitationRepository.findByInviteeUserId(userId);
        return invitations.stream()
                .map(Invitation::getStudyGroup)
                .distinct()
                .collect(Collectors.toList());
    }

}
