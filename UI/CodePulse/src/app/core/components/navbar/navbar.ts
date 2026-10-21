import { Component, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styles: [],
})
export class Navbar {
  isAdminOpen = false;
  isMobileMenuOpen = false;

  constructor(private elementRef: ElementRef) {}

  toggleAdminMenu(): void {
    this.isAdminOpen = !this.isAdminOpen;
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  // Close dropdown automatically when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isAdminOpen = false;
    }
  }
}
