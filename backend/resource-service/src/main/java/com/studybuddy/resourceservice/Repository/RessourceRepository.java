package com.studybuddy.resourceservice.Repository;


import com.studybuddy.resourceservice.Entity.Ressource;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RessourceRepository extends JpaRepository<Ressource, Long> {
}
