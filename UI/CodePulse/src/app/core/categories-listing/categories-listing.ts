import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  AddCategoryComponent,
  CreateCategoryRequest,
} from '../../Features/add-category/add-category';
export interface Category {
  id: string;
  name: string;
  urlHandle: string;
}

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, RouterLink, AddCategoryComponent],
  templateUrl: './categories-listing.html',
  styles: [],
})
export class CategoryListComponent {
  isAddModalOpen = false;

  categories: Category[] = [
    { id: 'c101', name: 'ASP.NET Core', urlHandle: 'aspnet-core' },
    { id: 'c102', name: 'Angular', urlHandle: 'angular' },
    { id: 'c103', name: 'Tailwind CSS', urlHandle: 'tailwind-css' },
    { id: 'c104', name: 'SQL Server', urlHandle: 'sql-server' },
  ];

  openAddModal(): void {
    this.isAddModalOpen = true;
  }

  closeAddModal(): void {
    this.isAddModalOpen = false;
  }

  onCategoryCreated(newCategory: CreateCategoryRequest): void {
    // Local mock addition (will be replaced with API service call)
    const category: Category = {
      id: `c${Date.now().toString().slice(-3)}`,
      name: newCategory.name,
      urlHandle: newCategory.urlHandle,
    };
    this.categories.unshift(category);
  }
}
