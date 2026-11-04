import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  inject,
  signal,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../services/category.service'; // Adjust path to your CategoryService
import { Category } from '../../models/category-model'; // Adjust path to your Category model
@Component({
  selector: 'app-edit-category',
  imports: [ReactiveFormsModule],
  templateUrl: './edit-category.html',
  styles: ``,
})
export class EditCategoryComponent implements OnInit, OnChanges {
  private fb = inject(FormBuilder);
  private categoryService = inject(CategoryService);

  @Input({ required: true }) isOpen = false;
  @Input() categoryId: string | number | null = null;

  @Output() close = new EventEmitter<void>();
  @Output() categoryUpdated = new EventEmitter<Category>();

  editForm!: FormGroup;
  isSubmitting = signal(false);
  isLoadingCategory = signal(false);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Re-fetch category details whenever the modal opens with a valid ID
    if (changes['isOpen']?.currentValue && this.categoryId) {
      this.loadCategoryDetails(this.categoryId);
    }
  }

  private initForm(): void {
    this.editForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      urlHandle: ['', [Validators.required, Validators.pattern('^[a-z0-9-]+$')]],
    });

    // Auto-generate URL Handle from Category Name if user hasn't manually altered it
    this.editForm.get('name')?.valueChanges.subscribe((name) => {
      if (this.editForm.get('urlHandle')?.pristine && name) {
        const handle = name
          .toLowerCase()
          .trim()
          .replace(/[\s\W-]+/g, '-');
        this.editForm.patchValue({ urlHandle: handle }, { emitEvent: false });
      }
    });
  }

  private loadCategoryDetails(id: string | number): void {
    this.isLoadingCategory.set(true);
    this.errorMessage.set(null);

    this.categoryService.getCategoryById(id).subscribe({
      next: (category) => {
        this.editForm.patchValue({
          name: category.name,
          urlHandle: category.urlHandle,
        });
        this.isLoadingCategory.set(false);
      },
      error: (err) => {
        this.errorMessage.set('Failed to load category data. Please try again.');
        this.isLoadingCategory.set(false);
      },
    });
  }

  onSubmit(): void {
    if (this.editForm.invalid || !this.categoryId) {
      this.editForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const updatedData = {
      id: this.categoryId,
      ...this.editForm.value,
    };

    this.categoryService.updateCategory(this.categoryId, updatedData).subscribe({
      next: (updatedCategory) => {
        this.isSubmitting.set(false);
        this.categoryUpdated.emit(updatedCategory);
        this.onClose();
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(
          err?.error?.message || 'Failed to update category. Please try again.',
        );
      },
    });
  }

  onClose(): void {
    this.editForm.reset();
    this.errorMessage.set(null);
    this.close.emit();
  }
}
