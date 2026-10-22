import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CategoryService, Category } from '../../Services/category-service';
import { AddCategoryComponent } from '../add-category/add-category';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, RouterLink, AddCategoryComponent],
  templateUrl: './categories-listing.html',
  styles: [],
})
export class CategoryListComponent {
  private categoryService = inject(CategoryService);

  isAddModalOpen = false;

  categoriesResource = this.categoryService.getAllCategories();

  get categories(): Category[] {
    return this.categoriesResource.value() ?? [];
  }

  openAddModal(): void {
    this.isAddModalOpen = true;
  }

  closeAddModal(): void {
    this.isAddModalOpen = false;
  }

  // Called when the <app-add-category> modal emits 'categoryCreated'
  onCategoryCreated(): void {
    // Reloads your httpResource to fetch the updated category list from the backend
    this.categoriesResource.reload();

    // The modal is already closed via onClose() inside the modal component,
    // but you can ensure the flag is reset here if needed:
    this.isAddModalOpen = false;
  }
}
