import type { UploadFileInfo } from 'naive-ui'

export function extractImageIds(files: UploadFileInfo[]): number[] {
  return files.map(f => (f as any).id).filter((id): id is number => typeof id === 'number')
}
