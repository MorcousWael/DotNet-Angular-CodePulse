import { Component, OnInit, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BlogService } from '../../../Services/blog-service';
import { CategoryService } from '../../../Services/category-service';

@Component({
  selector: 'app-edit-blog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './edit-blog.html',
})
export class EditBlog implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private blogService = inject(BlogService);
  private categoryService = inject(CategoryService);

  // 1. Create a signal for the blog ID
  blogId = signal<string | null>(null);

  isSubmitting = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  activeTab = signal<'edit' | 'preview'>('edit');

  categoriesResource = this.categoryService.getAllCategories();
  availableCategories = computed(() => this.categoriesResource.value() || []);

  // 2. Pass the blogId signal getter to the service method
  blogResource = this.blogService.getBlogById(() => this.blogId());

  isLoadingBlog = computed(() => this.blogResource.isLoading());

  blogForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    urlHandle: ['', [Validators.required, Validators.pattern(/^[a-z0-9-]+$/)]],
    author: ['', Validators.required],
    featuredImageUrl: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]],
    publishedDate: ['', Validators.required],
    isVisible: [true],
    shortDescription: ['', Validators.required],
    content: ['', Validators.required],
    categories: this.fb.array([], Validators.required),
  });

  imageUrlValue = computed(() => this.blogForm.get('featuredImageUrl')?.value);
  renderedContent = computed(() => this.blogForm.get('content')?.value || '');

  constructor() {
    // 3. Automatically patch form fields when the API data resolves
    effect(() => {
      const blog = this.blogResource.value();
      if (blog) {
        this.patchBlogForm(blog);
      }
    });
  }

  ngOnInit(): void {
    // 4. Extract ID from route parameters and update the signal
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.blogId.set(id); // This triggers the httpResource automatically!
    }
  }

  patchBlogForm(blog: any) {
    this.blogForm.patchValue({
      title: blog.title,
      urlHandle: blog.urlHandle,
      author: blog.author,
      featuredImageUrl: blog.featuredImageUrl,
      publishedDate: blog.publishedDate ? blog.publishedDate.split('T')[0] : '',
      isVisible: blog.isVisible,
      shortDescription: blog.shortDescription,
      content: blog.content,
    });

    const categoriesArray = this.blogForm.get('categories') as FormArray;
    categoriesArray.clear();

    if (blog.categories && Array.isArray(blog.categories)) {
      blog.categories.forEach((cat: any) => {
        categoriesArray.push(this.fb.control(cat.id));
      });
    }
  }

  isCategorySelected(categoryId: string): boolean {
    const categoriesArray = this.blogForm.get('categories') as FormArray;
    return categoriesArray.value.includes(categoryId);
  }

  onCategoryChange(categoryId: string, event: any): void {
    const categoriesArray = this.blogForm.get('categories') as FormArray;
    if (event.target.checked) {
      categoriesArray.push(this.fb.control(categoryId));
    } else {
      const index = categoriesArray.controls.findIndex((x) => x.value === categoryId);
      if (index >= 0) categoriesArray.removeAt(index);
    }
    categoriesArray.markAsTouched();
  }

  onSubmit(): void {
    if (this.blogForm.invalid || !this.blogId()) {
      this.blogForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    // Send the form value directly as a flat JSON object (no 'request' wrapper)
    const payload = this.blogForm.value;

    console.log('Sending flat payload:', payload);

    this.blogService.updateBlog(this.blogId()!, payload).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.router.navigate(['/admin/blogs']);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.title || 'Failed to update blog post.');
        this.isSubmitting.set(false);
      },
    });
  }
}
