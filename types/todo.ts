export interface AuthRequest {
  email: string;
  password: string;
}

export interface RegisterResponse {
  email: string;
  _id: string;
}

export type Status = "todo" | "in progress" | "done";

export interface TodosResponse {
  _id: string;
  name: string;
  description: string;
  status: Status;
}
