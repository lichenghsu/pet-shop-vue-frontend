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
      @close="showFormModal = false"
      @refresh="fetchProducts"
    />
  </n-modal>
</template>

<script setup lang="ts">
import { ref, onMounted, h } from 'vue'
import { useMessage, useDialog, NSpace, NButton, type DataTableColumns } from 'naive-ui'
import { getAllProducts, deleteProduct, type Product } from '@/api/product'
import { getAllCategories } from '@/api/category'
import { type CategoryResponse } from '@/types/categoryResponse'
import { getAllTags } from '@/api/tag'
import { type TagResponse } from '@/types/tagResponse'
import ProductForm from '@/components/admin/ProductForm.vue'
import request from '@/api/axios'

const products = ref<Product[]>([])
const categories = ref<CategoryResponse[]>([])
const tags = ref<TagResponse[]>([])

const showFormModal = ref(false)
const editingProduct = ref<Product | null>(null)
const message = useMessage()
const dialog = useDialog()
const base = request.defaults.baseURL

const columns: DataTableColumns<Product> = [
  { title: 'ID', key: 'id' },
  { title: '名稱', key: 'name' },
  { title: '價格', key: 'price' },
  { title: '描述', key: 'description' },
  {
    title: '圖片',
    key: 'images',
    render(row) {
      const firstId =
        Array.isArray(row.imageIds) && row.imageIds.length > 0 ? row.imageIds[0] : null
      const url = firstId ? `${base}/images/${firstId}` : ''

      return h('img', {
        src: url,
        style: {
          width: '80px',
          height: '80px',
          objectFit: 'cover',
          borderRadius: '4px',
          border: '1px solid #eee'
        }
      })
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
            type: 'primary',
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
    imageUrls: product.imageUrls ?? [],
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
