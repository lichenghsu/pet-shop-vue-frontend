import request from './axios'

export interface Product {
  id: number
  name: string
  description: string
  price: number
  imageUrl?: string
  category?: {
    id: number
    name: string
  }
  tags?: {
    id: number
    name: string
  }[]
}

// GET /products
export function getAllProducts() {
  return request.get<Product[]>('/products')
}

// GET /products/{id}
export function getProduct(id: number) {
  return request.get<Product>(`/products/${id}`)
}

// POST /products
export function createProduct(data: Partial<Product>) {
  return request.post('/products', data)
}

// PUT /products/{id}
export function updateProduct(id: number, data: Partial<Product>) {
  return request.put(`/products/${id}`, data)
}

// DELETE /products/{id}
export function deleteProduct(id: number) {
  return request.delete(`/products/${id}`)
}
