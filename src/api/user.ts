import request from '@/api/axios'
import type { UserResponse } from '@/types/userResponse'

export function getAllUsers() {
  return request.get<UserResponse[]>('/users/admin')
}

export function toggleUserActive(id: number, isActive: boolean) {
  return request.patch(`/users/admin/${id}/active`, { isActive })
}
