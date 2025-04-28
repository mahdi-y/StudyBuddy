package com.studybuddy.resourceservice.Service;

import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.studybuddy.resourceservice.Entity.Ressource;
import com.studybuddy.resourceservice.Repository.RessourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RessourceService {

    private static final Logger log = LoggerFactory.getLogger(RessourceService.class);

    @Autowired
    private RessourceRepository ressourceRepository;

    @Transactional
    public List<Ressource> findAll() {
        try {
            return ressourceRepository.findAll();
        } catch (Exception e) {
            log.error("Error fetching resources", e);
            throw e;  // Rethrow the error after logging it
        }
    }

    public Optional<Ressource> findById(Long id) {
        return ressourceRepository.findById(id);
    }

    public Ressource save(Ressource ressource) {
        return ressourceRepository.save(ressource);
    }

    public void deleteById(Long id) {
        ressourceRepository.deleteById(id);
    }

}
