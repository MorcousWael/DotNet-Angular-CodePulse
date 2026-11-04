import { Injectable, inject } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/environment';
import { CreateCategoryRequest, Category } from '../models/category-model';
// Request DTO matching the POST body

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  // Using modern inject() function (or constructor injection if preferred)
  private http = inject(HttpClient);

  /**
   * Sends a POST request to create a new category
   */
  addCategory(model: CreateCategoryRequest): Observable<Category> {
    return this.http.post<Category>(environment.apiBaseUrl + '/api/categories', model);
  }

  /**
   * Fetches all categories
   */
  getAllCategories() {
    return httpResource<Category[]>(() => environment.apiBaseUrl + '/api/Categories');
  }
  /**
   * Fetches a single category by its ID for editing
   */
  getCategoryById(id: string | number): Observable<Category> {
    return this.http.get<Category>(`${environment.apiBaseUrl}/api/categories/${id}`);
  }

  /**
   * Sends a PUT request to update an existing category
   */
  updateCategory(id: string | number, model: CreateCategoryRequest): Observable<Category> {
    return this.http.put<Category>(`${environment.apiBaseUrl}/api/categories/${id}`, model);
  }
  deleteCategory(id: string | number): Observable<any> {
    return this.http.delete(`${environment.apiBaseUrl}/api/Categories/${id}`);
  }
}
