package com.studybuddy.resourceservice.Service;

import com.studybuddy.resourceservice.Entity.Ressource;
import com.studybuddy.resourceservice.Repository.RessourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RessourceService {

    @Autowired
    private RessourceRepository ressourceRepository;

    public List<Ressource> findAll() {
        return ressourceRepository.findAll();
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
