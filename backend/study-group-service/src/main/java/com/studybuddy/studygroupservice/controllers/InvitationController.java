package com.studybuddy.studygroupservice.controllers;

import com.studybuddy.studygroupservice.dto.InvitationDTO;
import com.studybuddy.studygroupservice.dto.StudyGroupDTO;
import com.studybuddy.studygroupservice.entities.Invitation;
import com.studybuddy.studygroupservice.services.InvitationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/invitations")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200") // if needed for frontend
public class InvitationController {

    private final InvitationService invitationService;

    @PostMapping
    public InvitationDTO createInvitation(@RequestBody InvitationDTO invitationDTO) {
        Invitation createdInvitation = invitationService.createInvitation(invitationDTO);
        return mapToInvitationDTO(createdInvitation);
    }
    @PostMapping("/send")  // Use '/send' endpoint for sending invitations
    public InvitationDTO sendInvitation(@RequestBody InvitationDTO invitationDTO) {
        return invitationService.sendInvitation(invitationDTO);
    }
    @GetMapping
    public List<InvitationDTO> getAllInvitations() {
        return invitationService.getAllInvitations();
    }

    @DeleteMapping("/{id}")
    public void deleteInvitation(@PathVariable Long id) {
        invitationService.deleteInvitation(id);
    }

    // Mapping Entity to DTO
    private InvitationDTO mapToInvitationDTO(Invitation invitation) {
        InvitationDTO dto = new InvitationDTO();
        dto.setId(invitation.getId());
        dto.setStatus(invitation.getStatus());
        dto.setType(invitation.getType());
        dto.setInviterUserId(invitation.getInviterUserId());
        dto.setInviteeUserId(invitation.getInviteeUserId());
        dto.setCreatedAt(invitation.getCreatedAt());

        // Minimal StudyGroupDTO
        StudyGroupDTO groupDTO = new StudyGroupDTO();
        groupDTO.setId(invitation.getStudyGroup().getId());
        groupDTO.setName(invitation.getStudyGroup().getName());
        groupDTO.setDescription(invitation.getStudyGroup().getDescription());

        dto.setStudyGroup(groupDTO);

        return dto;
    }
}
