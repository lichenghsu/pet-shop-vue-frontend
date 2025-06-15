<template>
  <div class="category-page">
    <n-space
      justify="space-between"
      align="center"
      class="mb-4"
      style="width: 100%; margin-bottom: 16px"
    >
      <n-h2>分類管理</n-h2>
      <n-button type="primary" @click="showModal = true">新增分類</n-button>
    </n-space>

    <!-- 分類列表 -->
    <n-table :columns="columns" :data="categories" striped />

    <!-- Modal 表單 -->
    <n-modal v-model:show="showModal" :title="isEditMode ? '編輯分類' : '新增分類'" preset="dialog">
      <n-form :model="form" :rules="rules" ref="formRef" label-width="80px">
        <n-form-item label="名稱" path="name">
          <n-input v-model:value="form.name" placeholder="請輸入分類名稱" />
        </n-form-item>
      </n-form>

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
import { ref, onMounted, h } from 'vue'
import {
  NH2,
  NTable,
  NButton,
  NSpace,
  NModal,
  NForm,
  NFormItem,
  NInput,
  useMessage,
  useDialog
} from 'naive-ui'
import type { FormRules } from 'naive-ui'
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  type Category
} from '@/api/category'

const categories = ref<Category[]>([])
const showModal = ref(false)
const isEditMode = ref(false)
const currentEditId = ref<number | null>(null)
const formRef = ref()
const message = useMessage()
const dialog = useDialog()

const form = ref({ name: '' })

const rules: FormRules = {
  name: {
    required: true,
    message: '請填寫分類名稱',
    trigger: 'blur'
  }
}

async function loadCategories() {
  const res = await getAllCategories()
  categories.value = res.data
}

function openCreateModal() {
  resetForm()
  showModal.value = true
}

function openEditModal(row: Category) {
  form.value = { name: row.name }
  isEditMode.value = true
  currentEditId.value = row.id
  showModal.value = true
}

async function handleSubmit() {
  await formRef.value?.validate()

  if (isEditMode.value && currentEditId.value !== null) {
    await updateCategory(currentEditId.value, form.value)
    message.success('分類更新成功')
  } else {
    await createCategory(form.value)
    message.success('分類新增成功')
  }

  showModal.value = false
  resetForm()
  await loadCategories()
}

function confirmDelete(row: Category) {
  dialog.warning({
    title: '確認刪除',
    content: `確定要刪除「${row.name}」嗎？`,
    positiveText: '確認',
    negativeText: '取消',
    onPositiveClick: async () => {
      await deleteCategory(row.id)
      message.success('分類已刪除')
      await loadCategories()
    }
  })
}

function resetForm() {
  form.value = { name: '' }
  isEditMode.value = false
  currentEditId.value = null
}

const columns = [
  { title: 'ID', key: 'id' },
  { title: '名稱', key: 'name' },
  {
    title: '操作',
    key: 'actions',
    render(row: Category) {
      return [
        h(
          NButton,
          {
            type: 'primary',
            size: 'small',
            style: 'margin-right: 8px',
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
      ]
    }
  }
]

onMounted(() => {
  loadCategories()
})
</script>

<style scoped>
.category-page {
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.mb-4 {
  margin-bottom: 16px;
}
</style>
