package com.studybuddy.studygroupservice.services;

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


    private final InvitationRepository invitationRepository;
    private final StudyGroupRepository studyGroupRepository;
    public InvitationDTO sendInvitation(InvitationDTO invitationDTO) {
        Invitation invitation = new Invitation();
        invitation.setStatus(invitationDTO.getStatus());
        invitation.setType(invitationDTO.getType());
        invitation.setInviterUserId(invitationDTO.getInviterUserId());
        invitation.setInviteeUserId(invitationDTO.getInviteeUserId());

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

        StudyGroup studyGroup = studyGroupRepository.findById(invitationDTO.getStudyGroup().getId())
                .orElseThrow(() -> new RuntimeException("Study group not found"));

        invitation.setStudyGroup(studyGroup);

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
