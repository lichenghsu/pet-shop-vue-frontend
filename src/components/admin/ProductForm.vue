<template>
  <n-form :model="form" :rules="rules" ref="formRef" label-width="80px">
    <n-form-item label="名稱" path="name">
      <n-input v-model:value="form.name" placeholder="請輸入商品名稱" />
    </n-form-item>

    <n-form-item label="價格" path="price">
      <n-input-number v-model:value="form.price" :min="0" />
    </n-form-item>

    <n-form-item label="描述" path="description">
      <n-input v-model:value="form.description" type="textarea" placeholder="請輸入商品描述" />
    </n-form-item>

    <n-form-item label="商品圖片" path="imageUrl">
      <n-upload
        list-type="image-card"
        :file-list="uploadFiles"
        :default-upload="false"
        @change="handleUploadChange"
        accept="image/*"
      >
        <n-button type="primary" size="small">
          <template #icon>
            <n-icon><Add /></n-icon>
          </template>
          新增
        </n-button>
      </n-upload>
    </n-form-item>

    <n-form-item
      label="分類"
      path="categoryId"
      :status="form.categoryId === 0 ? 'error' : undefined"
    >
      <n-select
        v-model:value="form.categoryId"
        :options="categoryOptions"
        placeholder="請選擇分類"
        :render-label="renderCategoryLabel"
      />
    </n-form-item>

    <n-form-item label="標籤" path="tagIds">
      <n-select
        v-model:value="form.tagIds"
        multiple
        tag
        :options="tagOptions"
        placeholder="請選擇標籤"
      />
    </n-form-item>

    <n-form-item>
      <n-button type="primary" @click="handleFormSubmit">
        {{ isEdit ? '更新' : '新增' }}
      </n-button>
    </n-form-item>
  </n-form>
</template>

<script setup lang="ts">
import { ref, watch, computed, h } from 'vue'
import { Add } from '@vicons/ionicons5'
import {
  NForm,
  NFormItem,
  NInput,
  NInputNumber,
  NSelect,
  NUpload,
  useMessage,
  type FormRules,
  type UploadFileInfo
} from 'naive-ui'
import request from '@/api/axios'
import { uploadImage, type ImageUploadResponse } from '@/api/image'
import type { Category } from '@/api/category'
import type { Tag } from '@/api/tag'
import { createProduct, updateProduct, type ProductRequest, type Product } from '@/api/product'

const props = defineProps<{
  initialValue: Partial<Product> | null
  categories: Category[]
  tags: Tag[]
}>()
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'refresh'): void
}>()
const message = useMessage()
const isEdit = computed(() => !!props.initialValue?.id)

const formRef = ref()
const uploadFiles = ref<UploadFileInfo[]>([])
const base = request.defaults.baseURL

export type ProductImage =
  | { file: File } // 使用者剛選擇、尚未上傳的圖片
  | { id: number; url: string } // 已上傳過、有 ID 與 URL 的圖片

const form = ref<Partial<Product> & { images: ProductImage[] }>({
  name: '',
  price: 0,
  description: '',
  categoryId: 0,
  tagIds: [],
  images: []
})

const rules: FormRules = {
  name: { required: true, message: '請填寫商品名稱', trigger: 'blur' },
  price: { required: true, type: 'number', message: '請填寫商品價格', trigger: 'blur' },
  categoryId: { required: true, type: 'number', message: '請選擇分類', trigger: 'change' }
}

const categoryOptions = computed(() => [
  { label: '請選擇分類', value: 0, disabled: true },
  ...props.categories.map(c => ({ label: c.name, value: c.id }))
])

const tagOptions = computed(() => props.tags.map(t => ({ label: t.name, value: t.id })))

watch(
  () => props.initialValue,
  val => {
    if (val) {
      form.value = {
        id: val.id,
        name: val.name,
        price: val.price,
        description: val.description,
        categoryId: val.categoryId,
        tagIds: val.tagIds,
        // 👉 將 imageIds 組成 imageUrl（字串形式，方便上傳組件顯示）
        images: (val.imageIds ?? []).map(id => ({
          id,
          url: `/images/${id}`
        }))
      }

      // uploadFiles 給 n-upload 顯示用

      uploadFiles.value = form.value.images.map((img, index) => {
        if ('id' in img) {
          return {
            id: `${img.id}`,
            name: `圖片 ${index + 1}`,
            status: 'finished',
            url: `${base}${img.url}`,
            thumbnailUrl: `${base}${img.url}`,
            percentage: 100,
            type: 'image/png'
          }
        }

        return {
          id: `${index}`,
          name: `圖片 ${index + 1}`,
          status: 'pending',
          file: img.file,
          percentage: 0,
          type: 'image/png'
        }
      })
    }
  },
  { immediate: true }
)

const handleUploadChange = ({ fileList }: { fileList: UploadFileInfo[] }) => {
  uploadFiles.value = fileList

  form.value.images = fileList
    .map(f => {
      if (f.file) {
        return { file: f.file }
      } else if (f.id && f.url) {
        return {
          id: Number(f.id),
          url: f.url
        }
      }
      return null
    })
    .filter((f): f is ProductImage => f !== null)
}
function renderCategoryLabel(option: any) {
  if (option.disabled) {
    return h('span', { style: 'color: #aaa;' }, option.label)
  }
  return option.label
}

function resetForm() {
  form.value = {
    name: '',
    price: 0,
    description: '',
    categoryId: 0,
    tagIds: [],
    images: []
  }
  uploadFiles.value = []
}

async function handleFormSubmit() {
  await formRef.value?.validate(async (errors: any) => {
    if (errors) {
      message.warning('表單驗證失敗')
      return
    }

    const product = form.value
    message.info('✔️ 表單驗證通過，準備處理圖片...')

    // 👉 分類圖片
    const oldImages = product.images.filter((f): f is { id: number; url: string } => 'id' in f)
    const newImages = product.images.filter((f): f is { file: File } => 'file' in f)

    // 👉 上傳新圖片
    let uploaded: ImageUploadResponse[] = []
    if (newImages.length > 0) {
      message.info(`📤 偵測到 ${newImages.length} 張新圖片，開始上傳...`)
      const formData = new FormData()
      newImages.forEach(f => formData.append('files', f.file))

      try {
        const res = await uploadImage(formData)
        uploaded = res.data
        message.success(`✅ 成功上傳 ${uploaded.length} 張圖片`)
      } catch (err) {
        message.error('圖片上傳失敗，請稍後再試')
        return
      }
    } else {
      message.info('🟡 沒有新圖片需要上傳')
    }

    // 👉 組合所有圖片 ID（舊圖 + 新圖）
    const imageIds = [...oldImages.map(img => img.id), ...uploaded.map(img => img.id)]

    if (imageIds.length === 0) {
      message.error('請至少上傳一張圖片')
      return
    }

    const payload: ProductRequest = {
      id: product.id!,
      name: product.name ?? '',
      description: product.description ?? '',
      price: product.price ?? 0,
      categoryId: product.categoryId ?? 0,
      tagIds: product.tagIds ?? [],
      imageIds
    }

    // 👉 呼叫 API 儲存資料
    try {
      if (product.id) {
        message.info('🔄 正在更新商品...')
        await updateProduct(product.id, payload)
        message.success('✅ 商品已更新')
      } else {
        message.info('➕ 正在建立新商品...')
        await createProduct(payload)
        message.success('✅ 商品已創建')
      }
    } catch (err) {
      console.error('❌ 儲存商品失敗:', err)
      message.error('儲存商品失敗，請稍後再試')
      return
    }

    resetForm()
    emit('close')
    emit('refresh')
  })
}
</script>

<style scoped>
.n-form {
  margin-top: 12px;
}
</style>
