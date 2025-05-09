package com.studybuddy.studygroupservice.controllers;

import com.studybuddy.studygroupservice.dto.InvitationDTO;
import com.studybuddy.studygroupservice.dto.StudyGroupDTO;
import com.studybuddy.studygroupservice.entities.Invitation;
import com.studybuddy.studygroupservice.services.InvitationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

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
        if (invitationDTO.getInviteeUserId() == null && invitationDTO.getInviteeEmail() == null) {
            // Return a 400 Bad Request error with a clear message
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invitee information is missing. Please provide either inviteeUserId or inviteeEmail.");
        }

        return invitationService.sendInvitation(invitationDTO);
    }

    @PutMapping("/{id}/reject")
    public InvitationDTO rejectInvitation(@PathVariable Long id) {
        return invitationService.handleInvitationResponse(id, "REJECTED");
    }
    @GetMapping("/pending")
    public List<InvitationDTO> getPendingInvitations(@RequestParam Long userId) {
        return invitationService.getPendingInvitations(userId);
    }
    @PutMapping("/{id}/accept")
    public InvitationDTO acceptInvitation(@PathVariable Long id) {
        return invitationService.handleInvitationResponse(id, "ACCEPTED");
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

        // Check if studyGroup is null before mapping
        if (invitation.getStudyGroup() != null) {
            StudyGroupDTO groupDTO = new StudyGroupDTO();
            groupDTO.setId(invitation.getStudyGroup().getId());
            groupDTO.setName(invitation.getStudyGroup().getName());
            groupDTO.setDescription(invitation.getStudyGroup().getDescription());
            dto.setStudyGroup(groupDTO);
        } else {
            // Handle case where studyGroup is null, if needed
            dto.setStudyGroup(null);
        }

        return dto;
    }

    @GetMapping("/study-group/{studyGroupId}")
    public List<InvitationDTO> getInviteesByStudyGroupId(@PathVariable Long studyGroupId) {
        List<Invitation> invitations = invitationService.getInviteesByStudyGroupId(studyGroupId);
        return invitations.stream()
                .map(this::mapToInvitationDTO)
                .toList();
    }

}
