package com.studybuddy.resourceservice.Controller;

import com.studybuddy.resourceservice.Entity.Category;
import com.studybuddy.resourceservice.Entity.Ressource;
import com.studybuddy.resourceservice.Service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.List;

@CrossOrigin(origins = "http://192.168.1.88:30080,http://192.168.1.91:30080,http://9.163.179.211:8069")  // Allow CORS from Angular frontend
@RestController
@RequestMapping("/categories")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping
    public List<Category> getAll() {
        return categoryService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Category> getOne(@PathVariable Long id) {
        return categoryService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Category create(@RequestBody Category category) {
        category.setCreatedAt(new Timestamp(System.currentTimeMillis()));
        return categoryService.save(category);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Category> update(@PathVariable Long id, @RequestBody Category updated) {
        return categoryService.findById(id).map(category -> {
            category.setName(updated.getName());
            category.setDescription(updated.getDescription());
            return ResponseEntity.ok(categoryService.save(category));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        categoryService.deleteById(id);
    }
}
