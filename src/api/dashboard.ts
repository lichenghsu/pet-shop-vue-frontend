import type { DashboardResponse } from '@/types/dashboardResponse'
import request from './axios'

export function getDashboardStats() {
  return request.get<DashboardResponse>('/dashboard/admin')
}
