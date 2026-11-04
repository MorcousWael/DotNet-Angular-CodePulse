import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // Adjust path

export const writerGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn() && authService.isWriter()) {
    return true;
  }

  // If not logged in or not a writer, redirect to login or home
  alert('Access denied. Writer role required.');
  router.navigate(['/login']);
  return false;
};
