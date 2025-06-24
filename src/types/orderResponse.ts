export interface OrderItemDto {
  productName: string
  quantity: number
  price: number
}

export interface OrderResponse {
  id: number
  userId: number
  username: string
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
  createdAt: string
  items: OrderItemDto[]
}
