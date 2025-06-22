import request from './axios'

export interface ImageUploadResponse {
  id: number
  url: string
}

export interface ImageMeta {
  name: string
  url: string
  imageId?: number
  file?: File
  status?: 'finished' | 'uploading' | 'error'
}

// POST /images
export function uploadImage(formData: FormData) {
  return request.post<ImageUploadResponse[]>('/images', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    withCredentials: true
  })
}

// GET /images/{id}
export function getImageById(id: string) {
  return request.get(`/images/${id}`)
}
