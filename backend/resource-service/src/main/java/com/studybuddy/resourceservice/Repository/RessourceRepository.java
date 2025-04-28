package com.studybuddy.resourceservice.Repository;


import com.studybuddy.resourceservice.Entity.Ressource;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RessourceRepository extends JpaRepository<Ressource, Long> {
    List<Ressource> findByStudyGroupId(Long studyGroupId);

}
