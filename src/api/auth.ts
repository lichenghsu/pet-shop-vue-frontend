import request from './axios'
import { type LoginRequest } from '@/types/loginRequest'
import { type AuthResponse } from '@/types/authResponse'

// POST /auth/login
export function login(data: LoginRequest) {
  return request.post<AuthResponse>('/auth/login', data)
}

// POST /auth/register
export function register(data: { email: string; password: string; name: string }) {
  return request.post('/auth/register', data)
}
