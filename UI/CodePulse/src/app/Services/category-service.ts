import { Injectable, inject } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { Observable } from 'rxjs';

// Request DTO matching the POST body
export interface CreateCategoryRequest {
  name: string;
  urlHandle: string;
}

// Response DTO returned by the .NET API
export interface Category {
  id: string;
  name: string;
  urlHandle: string;
}

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  // Using modern inject() function (or constructor injection if preferred)
  private http = inject(HttpClient);

  // Base API URL (adjust to match your .NET backend port)
  private apiBaseUrl = 'https://localhost:7014';

  /**
   * Sends a POST request to create a new category
   */
  addCategory(model: CreateCategoryRequest): Observable<Category> {
    return this.http.post<Category>(this.apiBaseUrl + '/api/categories', model);
  }

  /**
   * Fetches all categories
   */
  getAllCategories() {
    return httpResource<Category[]>(() => this.apiBaseUrl + '/api/Categories');
  }
}
