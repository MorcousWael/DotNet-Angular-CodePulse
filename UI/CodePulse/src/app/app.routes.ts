import { Routes } from '@angular/router';
import { CategoryListComponent } from './Features/categories-listing/categories-listing';
import { AddBlog } from './Features/blog/add-blog/add-blog';
import { BlogsListing } from './Features/blog/blogs-listing/blogs-listing';

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
  {
    path: 'admin/blogs/add',
    component: AddBlog,
  },
  {
    path: 'admin/blogs',
    component: BlogsListing,
  },

  // Fallback wildcard route (optional: for 404s)
  {
    path: '**',
    redirectTo: 'admin/categories',
  },
];
