import request from './axios'

export interface Tag {
  id: number
  name: string
}

// GET /tags
export function getAllTags() {
  return request.get<Tag[]>('/tags')
}

// GET /tags/{id}
export function getTagById(id: number) {
  return request.get<Tag>(`/tags/${id}`)
}

// POST /tags
export function createTag(data: { name: string }) {
  return request.post('/tags', data)
}

// PUT /tags/{id}
export function updateTag(id: number, data: { name: string }) {
  return request.put(`/tags/${id}`, data)
}

// DELETE /tags/{id}
export function deleteTag(id: number) {
  return request.delete(`/tags/${id}`)
}

// GET /tags/search?keyword=xxx
export function searchTags(keyword: string) {
  return request.get<Tag[]>(`/tags/search`, {
    params: { keyword }
  })
}
