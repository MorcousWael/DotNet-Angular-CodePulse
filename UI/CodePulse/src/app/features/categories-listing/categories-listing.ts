import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { AddCategoryComponent } from '../add-category/add-category';
import { EditCategoryComponent } from '../edit-category/edit-category';
import { Category } from '../../models/category-model';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, AddCategoryComponent, EditCategoryComponent],
  templateUrl: './categories-listing.html',
  styles: [],
})
export class CategoryListComponent {
  private categoryService = inject(CategoryService);
  isEditModalOpen = false;
  selectedCategoryId: string | null = null;

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
  openEditModal(id: string): void {
    this.selectedCategoryId = id;
    this.isEditModalOpen = true;
  }

  // Close the modal and clear the selected ID
  closeEditModal(): void {
    this.isEditModalOpen = false;
    this.selectedCategoryId = null;
  }

  // Triggered when the category is successfully updated in the modal
  onCategoryUpdated(): void {
    // If you are using Angular's rxResource:
    this.categoriesResource.reload();

    // OR if you are using a standard service subscription/signal:
    // this.loadCategories();
  }
  deleteCategory(id: string | number, name: string): void {
    const confirmed = window.confirm(`Are you sure you want to delete the category "${name}"?`);

    if (!confirmed) {
      return;
    }

    this.categoryService.deleteCategory(id).subscribe({
      next: () => {
        // Refresh the categories table data
        this.categoriesResource.reload();
      },
      error: (err) => {
        alert('Failed to delete category. Please try again.');
        console.error(err);
      },
    });
  }
}
