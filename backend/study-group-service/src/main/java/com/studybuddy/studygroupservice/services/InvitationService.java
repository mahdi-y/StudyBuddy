package com.studybuddy.studygroupservice.services;

import com.studybuddy.studygroupservice.dto.InvitationDTO;
import com.studybuddy.studygroupservice.entities.Invitation;
import com.studybuddy.studygroupservice.entities.StudyGroup;
import com.studybuddy.studygroupservice.repositories.InvitationRepository;
import com.studybuddy.studygroupservice.repositories.StudyGroupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class InvitationService {

    private final InvitationRepository invitationRepository;
    private final StudyGroupRepository studyGroupRepository;

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
}
