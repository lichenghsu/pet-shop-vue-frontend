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
      <n-button type="primary" @click="handleSubmit">
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
  type FormRules,
  type UploadFileInfo
} from 'naive-ui'
import request from '@/api/axios'
import { uploadImage } from '@/api/image'
import type { Category } from '@/api/category'
import type { Tag } from '@/api/tag'
import type { Product } from '@/api/product'

const props = defineProps<{
  initialValue: Partial<Product> | null
  categories: Category[]
  tags: Tag[]
}>()

const emit = defineEmits<{
  (e: 'submit', payload: Partial<Product>): void
}>()

const isEdit = computed(() => !!props.initialValue?.id)

const formRef = ref()
const uploadFiles = ref<UploadFileInfo[]>([])

const form = ref<Partial<Product> & { imageUrl: (string | File)[] }>({
  name: '',
  price: 0,
  description: '',
  categoryId: 0,
  tagIds: [] as number[],
  imageUrl: []
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
      // 資料初始化
      form.value = {
        id: val.id,
        name: val.name ?? '',
        price: val.price ?? 0,
        description: val.description ?? '',
        categoryId: val.categoryId ?? 0,
        tagIds: val.tagIds ?? [],
        imageUrl: (val.imageIds ?? []).map(id => `/api/images/${id}`)
      }
      uploadFiles.value = (form.value.imageUrl as string[]).map(
        (url, index): UploadFileInfo => ({
          id: String(index),
          name: `圖片 ${index + 1}`,
          status: 'finished',
          url,
          thumbnailUrl: url,
          percentage: 100,
          type: 'image/png'
        })
      )
    } else {
      form.value = {
        name: '',
        price: 0,
        description: '',
        categoryId: 0,
        tagIds: [],
        imageUrl: []
      }
      uploadFiles.value = []
    }
  },
  { immediate: true }
)
const handleUploadChange = ({ fileList }: { fileList: UploadFileInfo[] }) => {
  uploadFiles.value = fileList
  form.value.imageUrl = fileList.map(f => f.file ?? f.url).filter((f): f is File | string => !!f)
}

function renderCategoryLabel(option: any) {
  if (option.disabled) {
    return h('span', { style: 'color: #aaa;' }, option.label)
  }
  return option.label
}

function handleSubmit() {
  formRef.value?.validate(async (errors: any) => {
    if (errors) {
      console.warn('表單驗證失敗', errors)
      return
    }

    // 上傳新圖片
    const newFiles = uploadFiles.value.filter(f => !f.url && f.file)
    let uploadedIds: number[] = []

    if (newFiles.length > 0) {
      const formData = new FormData()
      newFiles.forEach(f => formData.append('files', f.file as File))

      try {
        const res = await uploadImage(formData)
        uploadedIds = res.data.map((i: { id: number }) => i.id)

        // 更新已上傳圖片的 url
        const base = request.defaults.baseURL
        newFiles.forEach((f, idx) => {
          f.url = `${base}/images/${uploadedIds[idx]}`
          f.status = 'finished'
        })
      } catch (err) {
        console.error('圖片上傳失敗', err)
        return
      }
    }

    const payload: Partial<Product> = {
      ...form.value,
      imageIds: uploadedIds
    }

    emit('submit', payload)
  })
}
</script>

<style scoped>
.n-form {
  margin-top: 12px;
}
</style>
