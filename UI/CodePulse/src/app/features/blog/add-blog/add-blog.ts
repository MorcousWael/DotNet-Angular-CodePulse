import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { BlogService } from '../../../services/blog.service';
import { marked } from 'marked';
import { Category } from '../../../models/category-model';
import { CategoryService } from '../../../services/category.service';
import { ImageUploader } from '../../../core/components/image-uploader/image-uploader';
@Component({
  selector: 'app-add-blog',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ImageUploader],
  templateUrl: './add-blog.html',
  styles: ``,
})
export class AddBlog implements OnInit {
  private fb = inject(FormBuilder);
  private blogService = inject(BlogService);
  private categoryService = inject(CategoryService);
  private router = inject(Router);

  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);
  imageUrlValue = signal('');
  // 1. Bind directly to your httpResource from the CategoryService
  categoriesResource = this.categoryService.getAllCategories();

  // 2. Computed signal safely extracting the category list
  availableCategories = computed(() => this.categoriesResource.value() ?? []);
  // Get today's date formatted as YYYY-MM-DD for the date picker default
  private today = new Date().toISOString().split('T')[0];

  blogForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    shortDescription: ['', [Validators.required, Validators.maxLength(300)]],
    content: ['', [Validators.required]],
    urlHandle: ['', [Validators.required, Validators.pattern('^[a-z0-9-]+$')]],
    featuredImageUrl: ['', [Validators.required, Validators.pattern('https?://.+')]],
    author: ['', [Validators.required]],
    publishedDate: [this.today, [Validators.required]],
    isVisible: [true, [Validators.required]],
    categories: [[], [Validators.required, Validators.minLength(1)]],
  });
  ngOnInit(): void {
    // Auto-generate URL handle from title
    this.blogForm.get('title')?.valueChanges.subscribe((title) => {
      if (this.blogForm.get('urlHandle')?.pristine && title) {
        const handle = title
          .toLowerCase()
          .trim()
          .replace(/[\s\W-]+/g, '-');
        this.blogForm.patchValue({ urlHandle: handle }, { emitEvent: false });
      }
    });

    this.blogForm.get('content')?.valueChanges.subscribe((val) => {
      this.contentValue.set(val || '');
    });

    this.blogForm.get('featuredImageUrl')?.valueChanges.subscribe((val) => {
      this.imageUrlValue.set(val || '');
    });
  }

  // Handle multi-select checkboxes
  onCategoryChange(categoryId: string, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const currentCategories: string[] = [...(this.blogForm.get('categories')?.value || [])];

    if (checkbox.checked) {
      currentCategories.push(categoryId);
    } else {
      const index = currentCategories.indexOf(categoryId);
      if (index > -1) {
        currentCategories.splice(index, 1);
      }
    }

    this.blogForm.get('categories')?.setValue(currentCategories);
    this.blogForm.get('categories')?.markAsTouched();
  }

  constructor() {
    // Auto-generate URL handle from title
    this.blogForm.get('title')?.valueChanges.subscribe((title) => {
      if (this.blogForm.get('urlHandle')?.pristine && title) {
        const handle = title
          .toLowerCase()
          .trim()
          .replace(/[\s\W-]+/g, '-');
        this.blogForm.patchValue({ urlHandle: handle }, { emitEvent: false });
      }
    });

    // Track real-time typing changes for the live markdown preview
    this.blogForm.get('content')?.valueChanges.subscribe((val) => {
      this.contentValue.set(val || '');
    });
    // Track real-time typing for live markdown preview
    this.blogForm.get('content')?.valueChanges.subscribe((val) => {
      this.contentValue.set(val || '');
    });

    // Track real-time typing for live image preview
    this.blogForm.get('featuredImageUrl')?.valueChanges.subscribe((val) => {
      this.imageUrlValue.set(val || '');
    });
  }

  // Toggle state to switch between "Edit" and "Preview" modes on smaller screens
  activeTab = signal<'edit' | 'preview'>('edit');

  // Signal holding the live raw text content of the markdown box
  contentValue = signal('');

  // Computed signal that automatically converts markdown to safe HTML strings live
  renderedContent = computed(() => {
    const text = this.contentValue();
    if (!text) return '<p class="text-slate-500 italic">Nothing to preview yet...</p>';
    // Parse markdown into HTML using marked
    return marked.parse(text) as string;
  });

  onSubmit(): void {
    if (this.blogForm.invalid) {
      this.blogForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    this.blogService.addBlog(this.blogForm.value).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        // Navigate back and pass a query parameter for success feedback
        this.router.navigate(['/admin/blogs'], {
          queryParams: { added: 'true' },
        });
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(
          err?.error?.message || 'Failed to create blog post. Please try again.',
        );
      },
    });
  }
}
