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
import { useMessage, useDialog, type DataTableColumns } from 'naive-ui'
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  type Product
} from '@/api/product'
import { getAllCategories, type Category } from '@/api/category'
import { getAllTags, type Tag } from '@/api/tag'
import ProductForm from '@/components/admin/ProductForm.vue'
import { extractImageUrls } from '@/utils/imageUtils.ts'

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
    key: 'imageUrl',
    render(row) {
      const urls = Array.isArray(row.imageUrl) ? row.imageUrl : [row.imageUrl]
      return urls.filter(Boolean).map((url, i) =>
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
          'n-button',
          {
            type: 'info',
            size: 'small',
            onClick: () => openEditModal(row)
          },
          { default: () => '編輯' }
        ),
        h(
          'n-button',
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

onMounted(async () => {
  await fetchProducts()
  await loadCategoriesAndTags()
})

async function fetchProducts() {
  const res = await getAllProducts()
  products.value = res.data
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
  editingProduct.value = product
  showFormModal.value = true
}

async function handleSubmit(product: Product) {
  try {
    const cloned = { ...product }
    const uploadedUrls = await extractImageUrls(product.imageUrl ?? [])
    cloned.imageUrl = [...uploadedUrls]

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
    message.error('儲存商品失敗')
  }
}

function confirmDelete(product: Product) {
  dialog.warning({
    title: '確認刪除',
    content: `確定要刪除「${product.name}」嗎？`,
    positiveText: '刪除',
    negativeText: '取消',
    async onPositiveClick() {
      try {
        await deleteProduct(product.id)
        message.success('商品已刪除')
        await fetchProducts()
      } catch (err) {
        message.error('刪除失敗')
        console.error(err)
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
