package com.studybuddy.studygroupservice.repositories;

import com.studybuddy.studygroupservice.entities.StudyGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudyGroupRepository extends JpaRepository<StudyGroup, Long> {
    List<StudyGroup> findByOwnerUserId(Long ownerUserId);
}
