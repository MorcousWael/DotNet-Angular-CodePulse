import { Routes } from '@angular/router';
import { CategoryListComponent } from './Features/categories-listing/categories-listing';
import { AddBlog } from './Features/blog/add-blog/add-blog';
import { BlogsListing } from './Features/blog/blogs-listing/blogs-listing';
import { EditBlog } from './Features/blog/edit-blog/edit-blog';
import { Home } from './Features/home/home';
import { BlogDetails } from './Features/blog/blog-details/blog-details';

export const routes: Routes = [
  // Redirect default root path '/' to categories list
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: Home,
  },
  {
    path: 'blogs/:id',
    component: BlogDetails,
  },

  // Admin routes
  {
    path: 'admin/categories',
    component: CategoryListComponent,
  },
  {
    path: 'admin/blogs/add',
    component: AddBlog,
  },
  {
    path: 'admin/blogs/:id',
    component: EditBlog,
  },
  {
    path: 'admin/blogs',
    component: BlogsListing,
  },

  // Fallback wildcard route (optional: for 404s)
  {
    path: '**',
    redirectTo: 'admin/home',
  },
];
