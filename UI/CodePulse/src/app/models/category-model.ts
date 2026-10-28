export interface CreateCategoryRequest {
  name: string;
  urlHandle: string;
}

// Response DTO returned by the .NET API
export interface Category {
  id: string;
  name: string;
  urlHandle: string;
}
