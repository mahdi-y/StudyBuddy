import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/services/category.service';
import { Category } from 'src/app/models/category.model';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  categories: Category[] = [];
  newCategory: Category = { name: '', description: '' };
  editingCategory: Category | null = null;

  constructor(private categoryService: CategoryService) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getAll().subscribe(data => {
      this.categories = data;
    });
  }

  addCategory(): void {
    this.categoryService.create(this.newCategory).subscribe({
      next: (res) => {
        console.log('Category added:', res);
        this.loadCategories(); // Refresh the list
        this.newCategory = { name: '', description: '' }; // Reset form
      },
      error: (err) => console.error('Error adding category:', err)
    });
  }


  startEdit(category: Category) {
    this.editingCategory = { ...category };
  }

  saveEdit() {
    if (this.editingCategory?.idCategory) {
      this.categoryService.update(this.editingCategory.idCategory, this.editingCategory).subscribe(() => {
        this.loadCategories();
        this.editingCategory = null;
      });
    }
  }

  deleteCategory(id?: number) {
    if (id) {
      this.categoryService.delete(id).subscribe(() => {
        this.loadCategories();
      });
    }
  }
}
