import { uploadImage, type ImageUploadResponse } from '@/api/image'
export async function extractImageUrls(files: (string | File)[]): Promise<string[]> {
  const realFiles = files.filter((item): item is File => item instanceof File)
  if (realFiles.length === 0) return files as string[]

  const formData = new FormData()
  realFiles.forEach(file => formData.append('files', file))

  const res = await uploadImage(formData)
  // res.data 是 ImageUploadResponse[]
  return Array.isArray(res.data) ? res.data.map(i => i.url) : []
}
