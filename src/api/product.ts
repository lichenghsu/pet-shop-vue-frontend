import request from './axios'

/**
 * Product 回傳資料格式（對應後端 ProductResponse）
 */
export interface Product {
  id: number
  name: string
  description: string
  price: number
  imageIds: number[]
  categoryId: number
  categoryName: string
  tagIds: number[]
  tagNames: string[]
}

/**
 * 前端編輯用的資料格式（含上傳時的 File）
 */
export interface EditableProduct extends Omit<Product, 'imageUrl'> {
  imageUrl: (string | File)[]
}

/**
 * 發送到後端的請求格式（對應 ProductRequest DTO）
 */
export interface ProductRequest {
  id?: number
  name: string
  price: number
  description: string
  categoryId: number
  tagIds: number[]
  imageIds: number[]
}

// ----------- API -----------

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
export function updateProduct(id: number, data: ProductRequest) {
  return request.put(`/products/${id}`, data)
}

// DELETE /products/{id}
export function deleteProduct(id: number) {
  return request.delete(`/products/${id}`)
}
