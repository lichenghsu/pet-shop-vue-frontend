<template>
  <div class="product-page">
    <!-- 標題 + 新增按鈕 -->
    <n-space justify="space-between" align="center" style="width: 100%; margin-bottom: 16px">
      <n-h2>商品管理</n-h2>
      <n-button type="primary" @click="showModal = true">新增商品</n-button>
    </n-space>

    <!-- 商品列表 -->
    <n-table :columns="columns" :data="products" striped />

    <!-- 新增商品 Modal -->
    <n-modal v-model:show="showModal" title="新增商品" preset="dialog">
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
      </n-form>

      <n-form-item label="標籤" path="tagIds">
        <n-select
          v-model:value="form.tagIds"
          multiple
          :options="tags.map((t: Tag) => ({ label: t.name, value: t.id }))"
          placeholder="請選擇標籤"
        />
      </n-form-item>

      <n-form-item label="分類" path="categoryId">
        <n-select
          v-model:value="form.categoryId"
          :options="categories.map((c: Category) => ({ label: c.name, value: c.id }))"
          placeholder="請選擇分類"
        />
      </n-form-item>

      <template #action>
        <n-button @click="showModal = false">取消</n-button>
        <n-button type="primary" @click="handleSubmit">
          {{ isEditMode ? '更新' : '新增' }}
        </n-button>
      </template>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
// Vue Core
import { ref, onMounted, h } from 'vue'

// Naive UI 元件與 hooks
import {
  NH2,
  NTable,
  NButton,
  NSpace,
  NModal,
  NForm,
  NFormItem,
  NInput,
  NInputNumber,
  useMessage,
  useDialog
} from 'naive-ui'
import type { FormRules } from 'naive-ui'

// 自訂 API 模組
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  type Product
} from '@/api/product'

import { getAllTags } from '@/api/tag'
import { getAllCategories } from '@/api/category'

interface ProductForm {
  name: string
  price: number
  description: string
  categoryId: number | null
  tagIds: number[]
}

const products = ref<Product[]>([])
const showModal = ref(false)
const message = useMessage()
const dialog = useDialog()

type Tag = { id: number; name: string }
const tags = ref<Tag[]>([])

type Category = { id: number; name: string }
const categories = ref<Category[]>([])

const formRef = ref()
const form = ref<ProductForm>({
  name: '',
  price: 0,
  description: '',
  categoryId: null,
  tagIds: []
})

const isEditMode = ref(false)
const currentEditId = ref<number | null>(null)

function resetForm() {
  form.value = { name: '', price: 0, description: '', categoryId: null, tagIds: [] }
  isEditMode.value = false
  currentEditId.value = null
}

function confirmDelete(row: Product) {
  dialog.warning({
    title: '確認刪除',
    content: `確定要刪除「${row.name}」嗎？`,
    positiveText: '確認',
    negativeText: '取消',
    onPositiveClick: async () => {
      await deleteProduct(row.id)
      message.success('刪除成功')
      await loadProducts()
    }
  })
}

function openEditModal(row: Product) {
  form.value = {
    name: row.name,
    price: row.price,
    description: row.description,
    categoryId: row.category?.id ?? null,
    tagIds: (row.tags ?? []).map((t: { id: number }) => t.id)
  }
  currentEditId.value = row.id
  isEditMode.value = true
  showModal.value = true
}

async function loadTags() {
  const res = await getAllTags()
  tags.value = res.data
}

async function loadCategories() {
  const res = await getAllCategories()
  categories.value = res.data
}

const columns = [
  { title: 'ID', key: 'id' },
  { title: '名稱', key: 'name' },
  { title: '價格', key: 'price' },
  {
    title: '操作',
    key: 'actions',

    render(row: Product) {
      return h('div', { style: 'display: flex; gap: 8px;' }, [
        h(
          NButton,
          {
            type: 'primary',
            size: 'small',
            onClick: () => openEditModal(row)
          },
          { default: () => '編輯' }
        ),
        h(
          NButton,
          {
            type: 'error',
            size: 'small',
            onClick: () => confirmDelete(row)
          },
          { default: () => '刪除' }
        )
      ])
    }
  }
]

const rules: FormRules = {
  name: {
    required: true,
    message: '請填寫商品名稱',
    trigger: 'blur'
  },
  price: {
    required: true,
    type: 'number',
    message: '請填寫商品價格',
    trigger: 'blur'
  },
  tagIds: {
    required: true,

    type: 'array',
    message: '請選擇商品標籤',
    trigger: 'change'
  },
  categoryId: {
    required: true,
    type: 'number',
    message: '請選擇商品分類',
    trigger: 'change'
  }
}

async function loadProducts() {
  const res = await getAllProducts()
  products.value = res.data
}

async function handleSubmit() {
  await formRef.value?.validate()

  if (isEditMode.value && currentEditId.value !== null) {
    await updateProduct(currentEditId.value, form.value)
    message.success('商品更新成功')
  } else {
    await createProduct(form.value)
    message.success('商品新增成功')
  }

  showModal.value = false
  await loadProducts()
  resetForm()
}

onMounted(() => {
  loadProducts()
  loadCategories()
  loadTags()
})
</script>

<style scoped>
.product-page {
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
