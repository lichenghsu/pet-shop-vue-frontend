<template>
  <!-- 標題與新增按鈕 -->
  <n-space
    justify="space-between"
    align="center"
    class="mb-4"
    syle="width: 100%; margin-bottom: 16px"
  >
    <n-h2>標籤管理</n-h2>
    <n-button type="primary" @click="openCreate">新增標籤</n-button>
  </n-space>

  <!-- 標籤列表 -->
  <n-data-table
    :columns="columns"
    :data="tags"
    :bordered="false"
    :pagination="{ pageSize: 20 }"
    striped
  />

  <!-- 新增／編輯標籤 Modal -->
  <n-modal v-model:show="showModal" :title="isEditMode ? '編輯標籤' : '新增標籤'" preset="dialog">
    <n-form :model="form" :rules="rules" ref="formRef" label-width="80px">
      <n-form-item label="名稱" path="name">
        <n-input v-model:value="form.name" placeholder="請輸入標籤名稱" />
      </n-form-item>
    </n-form>
    <template #action>
      <n-button @click="closeModal">取消</n-button>
      <n-button type="primary" @click="handleSubmit">{{ isEditMode ? '更新' : '新增' }}</n-button>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { h } from 'vue'
import {
  NH2,
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
import { getAllTags, createTag, deleteTag, updateTag } from '@/api/tag'
import { type TagResponse } from '@/types/tagResponse'

const tags = ref<TagResponse[]>([])
const showModal = ref(false)
const isEditMode = ref(false)
const currentEditId = ref<number | null>(null)
const message = useMessage()
const dialog = useDialog()
const formRef = ref()

const form = ref({ name: '' })

const rules: FormRules = {
  name: {
    required: true,
    message: '請輸入標籤名稱',
    trigger: 'blur'
  }
}

const columns = [
  { title: 'ID', key: 'id' },
  { title: '名稱', key: 'name' },
  {
    title: '操作',
    key: 'actions',
    render(row: TagResponse) {
      return [
        h(
          NButton,
          {
            size: 'small',
            type: 'primary',
            style: 'margin-right: 8px',
            onClick: () => openEdit(row)
          },
          { default: () => '編輯' }
        ),
        h(
          NButton,
          { size: 'small', type: 'error', onClick: () => handleDelete(row) },
          { default: () => '刪除' }
        )
      ]
    }
  }
]

function openCreate() {
  showModal.value = true
  isEditMode.value = false
  form.value = { name: '' }
  currentEditId.value = null
}

function openEdit(row: TagResponse) {
  showModal.value = true
  isEditMode.value = true
  form.value = { name: row.name }
  currentEditId.value = row.id
}

function closeModal() {
  showModal.value = false
  form.value = { name: '' }
  currentEditId.value = null
  isEditMode.value = false
}

async function handleSubmit() {
  await formRef.value?.validate()
  if (isEditMode.value && currentEditId.value !== null) {
    await updateTag(currentEditId.value, form.value)
    message.success('更新成功')
  } else {
    await createTag(form.value)
    message.success('新增成功')
  }
  closeModal()
  await loadTags()
}

function handleDelete(row: TagResponse) {
  dialog.warning({
    title: '確認刪除',
    content: `確定要刪除「${row.name}」嗎？`,
    positiveText: '確認',
    negativeText: '取消',
    onPositiveClick: async () => {
      await deleteTag(row.id)
      message.success('刪除成功')
      await loadTags()
    }
  })
}

async function loadTags() {
  const res = await getAllTags()
  tags.value = res.data
}

onMounted(loadTags)
</script>

<style scoped>
.tag-page {
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.mb-4 {
  margin-bottom: 16px;
  width: 100%;
}
</style>
