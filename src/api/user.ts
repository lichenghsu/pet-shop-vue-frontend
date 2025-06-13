import request from './axios'

export interface User {
  id: number
  name: string
  email: string
}

// GET /users/me
export function getCurrentUser() {
  return request.get<User>('/users/me')
}
