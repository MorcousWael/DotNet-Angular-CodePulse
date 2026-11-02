import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BlogService } from '../../Services/blog-service'; // Adjust path to your service

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styles: ``,
})
export class Home {
  private blogService = inject(BlogService);

  // Fetch blogs reactively using httpResource
  blogsResource = this.blogService.getAllBlogs();

  blogs = computed(() => this.blogsResource.value() || []);
  isLoading = computed(() => this.blogsResource.isLoading());
  hasError = computed(() => this.blogsResource.error());
}
