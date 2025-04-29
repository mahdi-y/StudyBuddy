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
        if (invitationDTO.getInviteeUserId() == null && invitationDTO.getInviteeEmail() == null) {
            throw new RuntimeException("Invitee information is missing. Please provide either inviteeUserId or inviteeEmail.");
        }

        Invitation invitation = new Invitation();
        invitation.setStatus("PENDING"); // ← Always set initial status
        invitation.setType(invitationDTO.getType());
        invitation.setInviterUserId(invitationDTO.getInviterUserId());

        // Handle invitee based on email or userId
        if (invitationDTO.getInviteeUserId() == null && invitationDTO.getInviteeEmail() != null) {
            Long inviteeUserId = userClient.getUserIdByEmail(invitationDTO.getInviteeEmail());
            if (inviteeUserId == null) {
                throw new RuntimeException("User not found for email: " + invitationDTO.getInviteeEmail());
            }
            invitation.setInviteeUserId(inviteeUserId);
        } else {
            invitation.setInviteeUserId(invitationDTO.getInviteeUserId());
        }

        // Validate study group
        if (invitationDTO.getStudyGroup() == null || invitationDTO.getStudyGroup().getId() == null) {
            throw new IllegalArgumentException("Study group or Study group ID is missing");
        }

        StudyGroup studyGroup = studyGroupRepository.findById(invitationDTO.getStudyGroup().getId())
                .orElseThrow(() -> new RuntimeException("Study group not found"));

        invitation.setStudyGroup(studyGroup);

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

        StudyGroup studyGroup = studyGroupRepository.findById(invitationDTO.getStudyGroup().getId())
                .orElseThrow(() -> new RuntimeException("Study group not found"));
        invitation.setStudyGroup(studyGroup);

        return invitationRepository.save(invitation);
    }

    public InvitationDTO handleInvitationResponse(Long invitationId, String responseStatus) {
        Invitation invitation = invitationRepository.findById(invitationId)
                .orElseThrow(() -> new RuntimeException("Invitation not found"));

        if (!"PENDING".equals(invitation.getStatus())) {
            throw new RuntimeException("Invitation has already been processed");
        }

        invitation.setStatus(responseStatus);
        invitationRepository.save(invitation);
        if ("ACCEPTED".equals(responseStatus)) {
            StudyGroup studyGroup = invitation.getStudyGroup();

            if (!studyGroup.getParticipantIds().contains(invitation.getInviteeUserId())) {
                studyGroup.getParticipantIds().add(invitation.getInviteeUserId());
                studyGroupRepository.save(studyGroup);
            }
        }

        return mapToInvitationDTO(invitation); // Make sure this method exists
    }

    public void deleteInvitation(Long id) {
        invitationRepository.deleteById(id);
    }

    public List<InvitationDTO> getPendingInvitations(Long userId) {
        List<Invitation> pendingInvitations = invitationRepository.findByInviteeUserIdAndStatus(userId, "PENDING");
        return pendingInvitations.stream()
                .map(this::mapToInvitationDTO)
                .collect(Collectors.toList());
    }

    public List<Invitation> getInviteesByStudyGroupId(Long studyGroupId) {
        return invitationRepository.findByStudyGroupId(studyGroupId);
    }

    private InvitationDTO mapToInvitationDTO(Invitation invitation) {
        InvitationDTO dto = new InvitationDTO();
        dto.setId(invitation.getId());
        dto.setStatus(invitation.getStatus());
        dto.setInviterUserId(invitation.getInviterUserId());
        dto.setInviteeUserId(invitation.getInviteeUserId());
        dto.setType(invitation.getType());
        dto.setCreatedAt(invitation.getCreatedAt());

        StudyGroupDTO groupDTO = new StudyGroupDTO();
        groupDTO.setId(invitation.getStudyGroup().getId());
        groupDTO.setName(invitation.getStudyGroup().getName());
        dto.setStudyGroup(groupDTO);

        return dto;
    }
}