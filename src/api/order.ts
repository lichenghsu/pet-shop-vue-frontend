import request from './axios'
import { type OrderResponse } from '@/types/orderResponse'

// GET /orders
export function getMyOrders() {
  return request.get<OrderResponse[]>('/orders')
}

// GET /orders/{id}
export function getOrderById(id: number) {
  return request.get<OrderResponse>(`/orders/${id}`)
}

// POST /orders
export function placeOrder(data: any) {
  return request.post('/orders', data)
}

// PUT /orders/{id}/items
export function updateOrderItems(id: number, items: any[]) {
  return request.put(`/orders/${id}/items`, items)
}
