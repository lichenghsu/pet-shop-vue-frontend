import request from './axios'

export interface Category {
  id: number
  name: string
}

// GET /categories
export function getAllCategories() {
  return request.get<Category[]>('/categories')
}

// GET /categories/{id}
export function getCategoryById(id: number) {
  return request.get<Category>(`/categories/${id}`)
}

// POST /categories
export function createCategory(data: { name: string }) {
  return request.post('/categories', data)
}

// PUT /categories/{id}
export function updateCategory(id: number, data: { name: string }) {
  return request.put(`/categories/${id}`, data)
}

// DELETE /categories/{id}
export function deleteCategory(id: number) {
  return request.delete(`/categories/${id}`)
}

// GET /categories/search?keyword=xxx
export function searchCategories(keyword: string) {
  return request.get<Category[]>(`/categories/search`, {
    params: { keyword }
  })
}
