export interface UpdateOrderStatusRequest {
  orderIds: number[]
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
}
