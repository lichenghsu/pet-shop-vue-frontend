import request from './axios'

export interface AdminOrder {
  id: number
  status: string
  // 視後端定義補齊
}

// GET /orders/admin
export function getAllAdminOrders() {
  return request.get<AdminOrder[]>('/orders/admin')
}

// GET /orders/admin/{id}
export function getAdminOrderById(id: number) {
  return request.get<AdminOrder>(`/orders/admin/${id}`)
}

// PATCH /orders/admin/{id}/cancel
export function cancelAdminOrder(id: number) {
  return request.patch(`/orders/admin/${id}/cancel`, {})
}

// PATCH /orders/admin/{id}/status
export function updateAdminOrderStatus(id: number, status: string) {
  return request.patch(`/orders/admin/${id}/status`, { status })
}
