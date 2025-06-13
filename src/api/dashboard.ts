import request from './axios'

export interface DashboardStats {
  products: number
  users: number
  revenue: number
}

export function fetchDashboardStats() {
  return request.get<DashboardStats>('/admin/dashboard')
}
