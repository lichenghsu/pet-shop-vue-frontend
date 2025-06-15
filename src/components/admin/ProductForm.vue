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
        multiple
        :default-upload="false"
        :file-list="uploadFiles"
        @change="handleUploadChange"
        accept="image/*"
      />
    </n-form-item>

    <n-form-item
      label="分類"
      path="categoryId"
      :status="Number(form.categoryId) === 0 ? 'error' : undefined"
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
  </n-form>
</template>

<script setup lang="ts">
import { ref, watch, computed, h } from 'vue'
import {
  NForm,
  NFormItem,
  NInput,
  NInputNumber,
  NSelect,
  NUpload,
  type UploadFileInfo
} from 'naive-ui'
import type { FormRules } from 'naive-ui'
import type { Category } from '@/api/category'
import type { Tag } from '@/api/tag'
import type { Product } from '@/api/product'

const props = defineProps<{
  initialValue: Partial<Product> | null
  categories: Category[]
  tags: Tag[]
}>()

const formRef = ref()

const form = ref<Partial<Product>>({
  name: '',
  price: 0,
  description: '',
  categoryId: 0,
  tagIds: [],
  imageUrl: [] as (string | File)[]
})

const uploadFiles = ref<UploadFileInfo[]>([])

const rules: FormRules = {
  name: { required: true, message: '請填寫商品名稱', trigger: 'blur' },
  price: { required: true, type: 'number', message: '請填寫商品價格', trigger: 'blur' },
  categoryId: { required: true, type: 'number', message: '請選擇分類', trigger: 'change' }
}

watch(
  () => props.initialValue,
  val => {
    if (val) {
      form.value = {
        name: val.name ?? '',
        price: val.price ?? 0,
        description: val.description ?? '',
        categoryId: val.categoryId ?? 0,
        tagIds: val.tagIds ?? [],
        imageUrl: typeof val.imageUrl === 'string' ? [val.imageUrl] : (val.imageUrl ?? [])
      }

      uploadFiles.value = (Array.isArray(val.imageUrl) ? val.imageUrl : [val.imageUrl])
        .filter(Boolean)
        .map((url, i) => ({
          id: String(i),
          name: '圖片',
          status: 'finished',
          url: url as string
        }))
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

function handleUploadChange({ fileList }: { fileList: UploadFileInfo[] }) {
  uploadFiles.value = fileList
  form.value.imageUrl = fileList.map(f => f.file || f.url).filter(Boolean) as (string | File)[]
}

const categoryOptions = computed(() => [
  { label: '請選擇分類', value: 0, disabled: true },
  ...props.categories.map(c => ({ label: c.name, value: c.id }))
])

const tagOptions = computed(() => props.tags.map(t => ({ label: t.name, value: t.id })))

function renderCategoryLabel(option: any) {
  if (option.disabled) {
    return h('span', { style: 'color: #aaa;' }, option.label)
  }
  return option.label
}
</script>

<style scoped>
.n-form {
  margin-top: 12px;
}
</style>
