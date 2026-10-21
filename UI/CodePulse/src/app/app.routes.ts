import { Routes } from '@angular/router';
import { CategoryListComponent } from './Features/categories-listing/categories-listing';

export const routes: Routes = [
  // Redirect default root path '/' to categories list
  {
    path: '',
    redirectTo: 'admin/categories',
    pathMatch: 'full',
  },

  // Main Categories Listing Route
  {
    path: 'admin/categories',
    component: CategoryListComponent,
  },

  // Fallback wildcard route (optional: for 404s)
  {
    path: '**',
    redirectTo: 'admin/categories',
  },
];
