import request from './axios'

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  token: string
}

// POST /auth/login
export function login(data: LoginRequest) {
  return request.post<AuthResponse>('/auth/login', data)
}

// POST /auth/register
export function register(data: { email: string; password: string; name: string }) {
  return request.post('/auth/register', data)
}
