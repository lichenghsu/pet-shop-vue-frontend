import request from './axios'

export interface Order {
  id: number
  status: string
  // 其他欄位視後端定義補上
}

// GET /orders
export function getMyOrders() {
  return request.get<Order[]>('/orders')
}

// GET /orders/{id}
export function getOrderById(id: number) {
  return request.get<Order>(`/orders/${id}`)
}

// POST /orders
export function createOrder(data: any) {
  return request.post('/orders', data)
}

// PUT /orders/{id}/items
export function updateOrderItems(id: number, items: any[]) {
  return request.put(`/orders/${id}/items`, items)
}
