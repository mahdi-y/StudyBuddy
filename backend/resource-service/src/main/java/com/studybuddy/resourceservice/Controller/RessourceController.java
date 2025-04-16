package com.studybuddy.resourceservice.Controller;

import com.studybuddy.resourceservice.Entity.Ressource;
import com.studybuddy.resourceservice.Entity.StudyGroup;
import com.studybuddy.resourceservice.Service.RessourceService;
import com.studybuddy.resourceservice.Entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/ressources")
public class RessourceController {

    @Autowired
    private RessourceService ressourceService;

    @GetMapping
    public List<Ressource> getAll() {
        return ressourceService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ressource> getOne(@PathVariable Long id) {
        return ressourceService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Ressource create(@RequestBody Ressource ressource) {
        Timestamp now = new Timestamp(System.currentTimeMillis());
        ressource.setUploadedAt(now);
        ressource.setUpdatedAt(now);

        // Dummy objects
        User user = new User();
        user.setIdUser(1L);
        ressource.setUser(user);

        StudyGroup group = new StudyGroup();
        group.setIdGroup(1L);
        ressource.setGroup(group);

        return ressourceService.save(ressource);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Ressource> update(@PathVariable Long id, @RequestBody Ressource updated) {
        return ressourceService.findById(id).map(ressource -> {
            ressource.setTitle(updated.getTitle());
            ressource.setDescription(updated.getDescription());
            ressource.setFileUrl(updated.getFileUrl());
            ressource.setType(updated.getType());
            ressource.setCategory(updated.getCategory());
            ressource.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
            return ResponseEntity.ok(ressourceService.save(ressource));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        ressourceService.deleteById(id);
    }
}
