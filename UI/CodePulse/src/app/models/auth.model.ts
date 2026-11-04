export interface AuthResponse {
  email: string;
  token: string;
  roles: string[];
}

export interface AuthRequest {
  email: string;
  password: string;
}
