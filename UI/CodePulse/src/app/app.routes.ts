import { Routes } from '@angular/router';
import { CategoryListComponent } from './features/categories-listing/categories-listing';
import { AddBlog } from './features/blog/add-blog/add-blog';
import { BlogsListing } from './features/blog/blogs-listing/blogs-listing';
import { EditBlog } from './features/blog/edit-blog/edit-blog';
import { Home } from './features/home/home';
import { BlogDetails } from './features/blog/blog-details/blog-details';
import { Login } from './core/Auth/login/login';
import { Register } from './core/Auth/register/register';
import { writerGuard } from './core/Guards/auth.guard';

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
  //auth routes
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'register',
    component: Register,
  },

  // Admin routes
  {
    path: 'admin/categories',
    component: CategoryListComponent,
    canActivate: [writerGuard],
  },
  {
    path: 'admin/blogs/add',
    component: AddBlog,
    canActivate: [writerGuard],
  },
  {
    path: 'admin/blogs/:id',
    component: EditBlog,
    canActivate: [writerGuard],
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
