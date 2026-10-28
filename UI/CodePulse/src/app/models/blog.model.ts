export interface Category {
  id: string;
  name: string;
  urlHandle: string;
}

export interface Blog {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  urlHandle: string;
  featuredImageUrl: string;
  publishedDate: string | Date;
  author: string;
  isVisible: boolean;
  categories: Category[]; // <-- Properly typed instead of empty array []
}

export interface CreateBlogRequest {
  title: string;
  shortDescription: string;
  content: string;
  urlHandle: string;
  featuredImageUrl: string;
  author: string;
  publishedDate: string;
  isVisible: boolean;
  categories: String[];
}
