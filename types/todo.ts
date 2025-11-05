export interface AuthRequest {
  email: string;
  password: string;
}

export interface RegisterResponse {
  email: string;
  _id: string;
}
