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
  // Accepts a signal getter function () => string | null
  getBlogById(idSignal: () => string | null) {
    return httpResource<Blog>(() => {
      const id = idSignal();
      // If ID is null/empty, httpResource automatically defers the request
      if (!id) return undefined;
      return `${environment.apiBaseUrl}/api/BlogPosts/${id}`;
    });
  }

  updateBlog(id: string, blogData: any) {
    return this.http.put(`${environment.apiBaseUrl}/api/BlogPosts/${id}`, blogData);
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
