import {
  AuthRequest,
  RegisterResponse,
  Status,
  TodosResponse,
} from "@/types/todo";
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

interface CreateAndUpdateTodo {
  name: string;
  description: string;
  status: Status;
}

export async function getTodos(status?: Status) {
  try {
    const res = await api.get<TodosResponse[]>("/todos", {
      params: { status },
    });

    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function getTodoById(id: string) {
  try {
    const res = await api.get<TodosResponse>(`/todos/${id}`);

    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function createTodo(payload: CreateAndUpdateTodo) {
  try {
    const res = await api.post<TodosResponse>("/todos", payload);

    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function updateTodo(id: string, payload: CreateAndUpdateTodo) {
  try {
    const res = await api.patch<TodosResponse>(`/todos/${id}`, payload);

    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function deleteTodo(id: string) {
  try {
    await api.delete(`/todos/${id}`);
  } catch (error) {
    throw error;
  }
}

export async function register(payload: AuthRequest) {
  try {
    await api.post<RegisterResponse>("/auth/register", payload);

    const loginRes = await login(payload);

    return loginRes;
  } catch (error) {
    throw error;
  }
}

export async function login(payload: AuthRequest) {
  try {
    const res = await api.post<{ message: string }>("/auth/login", payload);

    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function logout(payload: AuthRequest) {
  try {
    await api.post("/auth/logout");
  } catch (error) {
    throw error;
  }
}
