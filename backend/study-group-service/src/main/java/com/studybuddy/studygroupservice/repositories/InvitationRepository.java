package com.studybuddy.studygroupservice.repositories;

import com.studybuddy.studygroupservice.entities.Invitation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InvitationRepository extends JpaRepository<Invitation, Long> {
    List<Invitation> findByInviteeUserId(Long inviteeUserId);
    List<Invitation> findByStudyGroupId(Long studyGroupId);
    List<Invitation> findByInviteeUserIdAndStatus(Long userId, String status);

}
