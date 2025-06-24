export interface AdminOrderItem {
  productName: string
  quantity: number
  price: number
}

export interface AdminOrderResponse {
  id: number
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
  createdAt: string
  userId: number
  username: string
  email: string
  items: AdminOrderItem[]
}
