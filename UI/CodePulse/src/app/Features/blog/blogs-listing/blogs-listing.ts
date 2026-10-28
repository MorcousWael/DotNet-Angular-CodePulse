import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { BlogService } from '../../../Services/blog-service';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-blogs-listing',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './blogs-listing.html',
  styles: ``,
})
export class BlogsListing implements OnInit {
  private blogService = inject(BlogService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // Fetch blogs using modern httpResource
  blogsResource = this.blogService.getAllBlogs();

  // Success banner visibility signal
  showSuccessBanner = signal(false);

  ngOnInit(): void {
    // Listen for query params to show success message when redirected from Add Blog
    this.route.queryParams.subscribe((params) => {
      if (params['added'] === 'true') {
        this.showSuccessBanner.set(true);

        // Hide banner after 4 seconds and clear URL param
        setTimeout(() => {
          this.showSuccessBanner.set(false);
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { added: null },
            queryParamsHandling: 'merge',
          });
        }, 4000);
      }
    });
  }

  deleteBlog(id: string, title: string): void {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    this.blogService.deleteBlog(id).subscribe({
      next: () => {
        // Refresh the table data
        this.blogsResource.reload();
      },
      error: (err) => {
        alert('Failed to delete blog post.');
        console.error(err);
      },
    });
  }
}
