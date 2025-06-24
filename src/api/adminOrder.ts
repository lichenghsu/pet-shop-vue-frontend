import request from './axios'
import { type AdminOrderResponse } from '@/types/adminOrderResponse'
import { type UpdateOrderStatusRequest } from '@/types/updateOrderStatusRequest'

// GET /orders/admin
export function getAllAdminOrderResponses() {
  return request.get<AdminOrderResponse[]>('/orders/admin')
}

// GET /orders/admin/{id}
export function getAdminOrderResponseById(id: number) {
  return request.get<AdminOrderResponse>(`/orders/admin/${id}`)
}

// PATCH /orders/admin/{id}/cancel
export function cancelAdminOrder(id: number) {
  return request.patch(`/orders/admin/${id}/cancel`, {})
}

// PATCH /orders/admin/{id}/status
export function updateOrderStatuses(params: { orderIds: number[]; status: string }) {
  return request.patch('/orders/admin/batch-status', params)
}

// PATCH /orders/admin/batch-status

export function batchUpdateStatus(data: UpdateOrderStatusRequest) {
  return request.patch('/orders/admin/batch-status', data)
}

// PUT /orders/admin/{id}/items
export function updateOrderItems(id: number, items: any[]) {
  return request.put(`/orders/admin/${id}/items`, items)
}
