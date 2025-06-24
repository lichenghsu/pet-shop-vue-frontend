export interface DashboardResponse {
  productCount: number
  userCount: number
  totalOrderAmount: number
  monthlyRevenue: {
    month: string
    total: number
  }[]
}
