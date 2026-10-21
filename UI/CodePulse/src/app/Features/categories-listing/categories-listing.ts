import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CategoryService, Category } from '../../Services/category-service';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
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

  onCategoryCreated(): void {
    // Re-fetch category list from database using the resource's reload method
    this.categoriesResource.reload();
  }
}
