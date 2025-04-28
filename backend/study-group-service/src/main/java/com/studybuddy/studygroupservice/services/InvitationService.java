package com.studybuddy.studygroupservice.services;

import com.studybuddy.studygroupservice.clients.UserClient;
import com.studybuddy.studygroupservice.dto.InvitationDTO;
import com.studybuddy.studygroupservice.dto.StudyGroupDTO;
import com.studybuddy.studygroupservice.entities.Invitation;
import com.studybuddy.studygroupservice.entities.StudyGroup;
import com.studybuddy.studygroupservice.repositories.InvitationRepository;
import com.studybuddy.studygroupservice.repositories.StudyGroupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InvitationService {

    private final UserClient userClient;
    private final InvitationRepository invitationRepository;
    private final StudyGroupRepository studyGroupRepository;
    public InvitationDTO sendInvitation(InvitationDTO invitationDTO) {
        // Check if either inviteeUserId or inviteeEmail is provided
        if (invitationDTO.getInviteeUserId() == null && invitationDTO.getInviteeEmail() == null) {
            throw new RuntimeException("Invitee information is missing. Please provide either inviteeUserId or inviteeEmail.");
        }

        // Create a new Invitation entity from the DTO
        Invitation invitation = new Invitation();
        invitation.setStatus(invitationDTO.getStatus());
        invitation.setType(invitationDTO.getType());
        invitation.setInviterUserId(invitationDTO.getInviterUserId());

        // Handle invitee based on the available information
        if (invitationDTO.getInviteeUserId() == null && invitationDTO.getInviteeEmail() != null) {
            Long inviteeUserId = userClient.getUserIdByEmail(invitationDTO.getInviteeEmail());
            if (inviteeUserId == null) {
                throw new RuntimeException("User not found for email: " + invitationDTO.getInviteeEmail());
            }
            invitation.setInviteeUserId(inviteeUserId);
        } else {
            invitation.setInviteeUserId(invitationDTO.getInviteeUserId());
        }

        // Ensure that the study group is not null
        if (invitationDTO.getStudyGroup() == null || invitationDTO.getStudyGroup().getId() == null) {
            throw new IllegalArgumentException("Study group or Study group ID is missing");
        }

        // Retrieve the study group
        StudyGroup studyGroup = studyGroupRepository.findById(invitationDTO.getStudyGroup().getId())
                .orElseThrow(() -> new RuntimeException("Study group not found with ID: " + invitationDTO.getStudyGroup().getId()));

        invitation.setStudyGroup(studyGroup);

        // Save the invitation and return the DTO
        Invitation savedInvitation = invitationRepository.save(invitation);

        return mapToInvitationDTO(savedInvitation);
    }

    public List<InvitationDTO> getAllInvitations() {
        List<Invitation> invitations = invitationRepository.findAll();
        return invitations.stream()
                .map(this::mapToInvitationDTO)
                .collect(Collectors.toList());
    }

    public Invitation createInvitation(InvitationDTO invitationDTO) {
        Invitation invitation = new Invitation();
        invitation.setStatus(invitationDTO.getStatus());
        invitation.setType(invitationDTO.getType());
        invitation.setInviterUserId(invitationDTO.getInviterUserId());
        invitation.setInviteeUserId(invitationDTO.getInviteeUserId());

        if (invitationDTO.getStudyGroup() == null || invitationDTO.getStudyGroup().getId() == null) {
            throw new IllegalArgumentException("Study group or Study group ID is missing");
        }

        // Retrieve the Study Group and associate it with the Invitation
        StudyGroup studyGroup = studyGroupRepository.findById(invitationDTO.getStudyGroup().getId())
                .orElseThrow(() -> new RuntimeException("Study group not found"));
        invitation.setStudyGroup(studyGroup);

        // Save and return the Invitation
        return invitationRepository.save(invitation);
    }

    public void deleteInvitation(Long id) {
        invitationRepository.deleteById(id);
    }

    private InvitationDTO mapToInvitationDTO(Invitation invitation) {
        InvitationDTO dto = new InvitationDTO();
        dto.setId(invitation.getId());
        dto.setStatus(invitation.getStatus());
        dto.setType(invitation.getType());
        dto.setInviterUserId(invitation.getInviterUserId());
        dto.setInviteeUserId(invitation.getInviteeUserId());
        dto.setCreatedAt(invitation.getCreatedAt());

        StudyGroupDTO groupDTO = new StudyGroupDTO();
        groupDTO.setId(invitation.getStudyGroup().getId());
        groupDTO.setName(invitation.getStudyGroup().getName());
        groupDTO.setDescription(invitation.getStudyGroup().getDescription());

        dto.setStudyGroup(groupDTO);

        return dto;
    }

    public List<Invitation> getInviteesByStudyGroupId(Long studyGroupId) {
        return invitationRepository.findByStudyGroupId(studyGroupId);
    }
}
