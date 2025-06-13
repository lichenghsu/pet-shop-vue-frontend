import request from './axios'

export interface ImageUploadResponse {
  url: string
  id: string
}

// POST /images
export function uploadImage(formData: FormData) {
  return request.post<ImageUploadResponse>('/images', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

// GET /images/{id}
export function getImageById(id: string) {
  return request.get(`/images/${id}`)
}
