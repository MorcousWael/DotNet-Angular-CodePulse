import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../Services/category-service';

export interface CreateCategoryRequest {
  name: string;
  urlHandle: string;
}

@Component({
  selector: 'app-add-category',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-category.html',
  styles: [],
})
export class AddCategoryComponent {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() categoryAdded = new EventEmitter<CreateCategoryRequest>();

  private categoryService = inject(CategoryService);

  categoryForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      urlHandle: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
          Validators.pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), // Only lowercase alphanumeric and single hyphens
        ],
      ],
    });
  }

  // Helper getters for easy template validation checks
  get nameControl() {
    return this.categoryForm.get('name');
  }

  get urlHandleControl() {
    return this.categoryForm.get('urlHandle');
  }

  // Auto-generate URL handle slug from Category Name
  onNameChange(): void {
    const nameValue = this.nameControl?.value || '';
    const slug = nameValue
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    this.categoryForm.patchValue({ urlHandle: slug });
    this.urlHandleControl?.markAsTouched();
  }

  onSubmit(): void {
    if (this.categoryForm.valid) {
      this.categoryService.addCategory(this.categoryForm.value).subscribe({
        next: (response) => {
          this.categoryAdded.emit(response);
          this.onClose();
        },
        error: (err) => {
          console.error('Error adding category:', err);
          // Handle API error state here if needed
        },
      });
    } else {
      this.categoryForm.markAllAsTouched();
    }
  }

  onClose(): void {
    this.categoryForm.reset();
    this.close.emit();
  }
}
