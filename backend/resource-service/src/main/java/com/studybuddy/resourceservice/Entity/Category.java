package com.studybuddy.resourceservice.Entity;

import jakarta.persistence.*;
import java.sql.Timestamp;
import java.util.List;

@Entity
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idCategory;

    private String name;
    private String description;
    private Timestamp createdAt;

    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL)
    private List<Ressource> ressources;

    // Getters and setters
    public Long getIdCategory() { return idCategory; }
    public void setIdCategory(Long idCategory) { this.idCategory = idCategory; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }

    public List<Ressource> getRessources() { return ressources; }
    public void setRessources(List<Ressource> ressources) { this.ressources = ressources; }
}
