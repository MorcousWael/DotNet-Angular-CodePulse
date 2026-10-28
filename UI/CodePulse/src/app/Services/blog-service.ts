import { Injectable, inject } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/environment.development'; // Adjust path to environment
import { Blog, CreateBlogRequest } from '../models/blog.model';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private http = inject(HttpClient);

  // Fetch all blogs using modern httpResource
  getAllBlogs() {
    return httpResource<Blog[]>(() => `${environment.apiBaseUrl}/api/BlogPosts`);
  }
  /**
   * Sends a POST request to create a new blog post
   */
  addBlog(model: CreateBlogRequest): Observable<Blog> {
    return this.http.post<Blog>(`${environment.apiBaseUrl}/api/BlogPosts`, model);
  }

  // Delete a blog by ID
  deleteBlog(id: string): Observable<any> {
    return this.http.delete(`${environment.apiBaseUrl}/api/BlogPosts/${id}`);
  }
}
