package com.studybuddy.resourceservice.Repository;
import com.studybuddy.resourceservice.Entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}