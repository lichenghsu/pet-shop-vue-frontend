import request from './axios'

export interface Tag {
  id: number
  name: string
}

export function getAllTags() {
  return request.get<Tag[]>('/tags')
}

export function getTagById(id: number) {
  return request.get<Tag>(`/tags/${id}`)
}

export function createTag(data: { name: string }) {
  return request.post('/tags', data)
}

export function deleteTag(id: number) {
  return request.delete(`/tags/${id}`)
}

export function searchTags(keyword: string) {
  return request.get<Tag[]>(`/tags/search`, {
    params: { keyword }
  })
}
