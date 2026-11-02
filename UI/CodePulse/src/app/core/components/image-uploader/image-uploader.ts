import { Component, Optional, Self, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { ImageService } from '../../../Services/image-service';

@Component({
  selector: 'app-image-uploader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-uploader.html',
  styles: ``,
})
export class ImageUploader implements ControlValueAccessor {
  private imageService = inject(ImageService);

  value: string = '';
  isDisabled: boolean = false;
  isUploading = signal<boolean>(false);

  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  constructor(@Optional() @Self() public ngControl: NgControl) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onFileSelected(event: Event): void {
    const element = event.target as HTMLInputElement;
    if (element.files && element.files.length > 0) {
      const file = element.files[0];

      // Clean up file name without extension for text fields
      const cleanFileName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;

      this.uploadImageFile(file, cleanFileName, `Featured Image - ${cleanFileName}`);
    }
  }

  uploadImageFile(file: File, fileName: string, title: string): void {
    this.isUploading.set(true);

    this.imageService.uploadImage(file, fileName, title).subscribe({
      next: (response) => {
        // Automatically maps the 'url' returned from your API response
        this.value = response.url;
        this.onChange(this.value);
        this.onTouched();
        this.isUploading.set(false);
      },
      error: (err) => {
        console.error('Image upload failed', err);
        this.isUploading.set(false);
        alert('Failed to upload image.');
      },
    });
  }

  onUrlInput(event: Event): void {
    const inputVal = (event.target as HTMLInputElement).value;
    this.value = inputVal;
    this.onChange(inputVal);
    this.onTouched();
  }
}
