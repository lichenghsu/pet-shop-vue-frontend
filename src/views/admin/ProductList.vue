<template>
  <!-- 標題 + 新增按鈕 -->
  <n-space justify="space-between" align="center" style="width: 100%; margin-bottom: 16px">
    <n-h2>商品管理</n-h2>
    <n-button type="primary" @click="openCreateModal">新增商品</n-button>
  </n-space>

  <!-- 商品列表 -->
  <n-data-table
    :columns="columns"
    :data="products"
    :bordered="false"
    :pagination="{ pageSize: 10 }"
  />

  <!-- 商品表單 Modal（新增 / 編輯） -->
  <n-modal
    v-model:show="showFormModal"
    :title="editingProduct ? '編輯商品' : '新增商品'"
    preset="dialog"
  >
    <ProductForm
      v-if="showFormModal"
      :initialValue="editingProduct"
      :categories="categories"
      :tags="tags"
      @submit="handleSubmit"
      @cancel="showFormModal = false"
    />
  </n-modal>
</template>

<script setup lang="ts">
import { ref, onMounted, h } from 'vue'
import { useMessage, useDialog, NSpace, NButton, type DataTableColumns } from 'naive-ui'
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  type ProductRequest,
  type Product
} from '@/api/product'
import { getAllCategories, type Category } from '@/api/category'
import { getAllTags, type Tag } from '@/api/tag'
import { uploadImage, type ImageUploadResponse } from '@/api/image'
import ProductForm from '@/components/admin/ProductForm.vue'

const products = ref<Product[]>([])
const categories = ref<Category[]>([])
const tags = ref<Tag[]>([])

const showFormModal = ref(false)
const editingProduct = ref<Product | null>(null)
const message = useMessage()
const dialog = useDialog()

const columns: DataTableColumns<Product> = [
  { title: 'ID', key: 'id' },
  { title: '名稱', key: 'name' },
  { title: '價格', key: 'price' },
  { title: '描述', key: 'description' },
  {
    title: '圖片',
    key: 'images', // 若有 API 回傳 `images` 關聯陣列可以改這欄位
    render(row) {
      const urls = Array.isArray(row.imageIds) ? row.imageIds.map(id => `/api/images/${id}`) : []

      return urls.map((url, i) =>
        h('img', {
          src: url,
          style: 'max-width: 80px; max-height: 80px; object-fit: cover; margin-right: 4px;',
          key: i
        })
      )
    }
  },
  {
    title: '操作',
    key: 'actions',
    render(row) {
      return h('div', { style: 'display: flex; gap: 8px;' }, [
        h(
          NButton,
          {
            type: 'info',
            size: 'medium',
            onClick: () => openEditModal(row)
          },
          { default: () => '編輯' }
        ),
        h(
          NButton,
          {
            type: 'error',
            size: 'medium',
            onClick: () => confirmDelete(row)
          },
          { default: () => '刪除' }
        )
      ])
    }
  }
]

async function fetchProducts() {
  try {
    const res = await getAllProducts()
    products.value = res.data
  } catch (err) {
    console.error('初始化失敗', err)
  }
}

async function loadCategoriesAndTags() {
  const [catRes, tagRes] = await Promise.all([getAllCategories(), getAllTags()])
  categories.value = catRes.data
  tags.value = tagRes.data
}

function openCreateModal() {
  editingProduct.value = null
  showFormModal.value = true
}

function openEditModal(product: Product) {
  editingProduct.value = {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    imageIds: product.imageIds ?? [],
    categoryId: product.categoryId ?? 0,
    categoryName: product.categoryName ?? '',
    tagIds: product.tagIds,
    tagNames: product.tagNames ?? []
  }
  showFormModal.value = true
}

function confirmDelete(product: Product) {
  dialog.warning({
    title: '確認刪除',
    content: `確定要刪除商品 "${product.name}" 嗎？`,
    positiveText: '刪除',
    negativeText: '取消',
    onPositiveClick: async () => {
      try {
        await deleteProduct(product.id)
        message.success('商品已刪除')
        await fetchProducts()
      } catch (err) {
        console.error('刪除商品失敗', err)
        message.error('刪除商品失敗')
      }
    }
  })
}

async function handleSubmit(product: Partial<Product> & { imageUrl?: (string | File)[] }) {
  try {
    const realFiles = (product.imageUrl ?? []).filter((f): f is File => typeof f !== 'string')

    let uploaded: ImageUploadResponse[] = []

    if (realFiles.length > 0) {
      const formData = new FormData()
      realFiles.forEach(f => formData.append('files', f))
      const res = await uploadImage(formData)
      uploaded = res.data
    }

    const existingIds = (product.imageUrl ?? [])
      .filter((f): f is string => typeof f === 'string')
      .map(url => {
        const match = url.match(/\/api\/images\/(\d+)/)
        return match ? parseInt(match[1]) : null
      })
      .filter((id): id is number => id !== null)

    const imageIds = [...existingIds, ...uploaded.map(i => i.id)]

    if (imageIds.length === 0) {
      message.error('請至少上傳一張圖片')
      return
    }

    const cloned: ProductRequest = {
      id: product.id!,
      name: product.name ?? '',
      description: product.description ?? '',
      price: product.price ?? 0,
      categoryId: product.categoryId ?? 0,
      tagIds: product.tagIds ?? [],
      imageIds: [...existingIds, ...uploaded.map(i => i.id)].filter(id => id > 0)
    }

    if (product.id) {
      await updateProduct(product.id, cloned)
      message.success('商品已更新')
    } else {
      await createProduct(cloned)
      message.success('商品已創建')
    }

    showFormModal.value = false
    await fetchProducts()
  } catch (err) {
    console.error('提交商品失敗', err)
    message.error('儲存商品失敗')
  }
}

onMounted(async () => {
  try {
    await fetchProducts()
    await loadCategoriesAndTags()
  } catch (err) {
    console.error('初始化失敗', err)
    message.error('載入資料失敗')
  }
})
</script>
