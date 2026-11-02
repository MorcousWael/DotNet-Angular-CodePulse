import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BlogService } from '../../../Services/blog-service';

@Component({
  selector: 'app-blog-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './blog-details.html',
  styles: ``,
})
export class BlogDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private blogService = inject(BlogService);

  // Reactive signal for the blog ID
  blogId = signal<string | null>(null);

  // Automatically fetches blog details when the ID signal updates
  blogResource = this.blogService.getBlogById(() => this.blogId());

  blog = computed(() => this.blogResource.value());
  isLoading = computed(() => this.blogResource.isLoading());
  hasError = computed(() => this.blogResource.error());

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.blogId.set(id);
    }
  }
}
