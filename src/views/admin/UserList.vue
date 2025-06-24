<template>
  <n-card title="會員列表">
    <n-data-table
      :columns="columns"
      :data="users"
      :pagination="pagination"
      :row-key="row => row.id"
      :scroll-x="1000"
    />
  </n-card>
</template>

<script setup lang="ts">
import { onMounted, ref, h } from 'vue'
import { NCard, NDataTable, NSwitch, useDialog, useMessage } from 'naive-ui'
import { getAllUsers, toggleUserActive } from '@/api/user'
import type { UserResponse } from '@/types/userResponse'

const message = useMessage()
const users = ref<UserResponse[]>([])
const dialog = useDialog()
const pagination = {
  pageSize: 20
}

const columns = [
  { title: 'ID', key: 'id' },
  { title: '帳號', key: 'username' },
  { title: 'Email', key: 'email' },
  {
    title: '角色',
    key: 'role'
  },
  {
    title: '建立時間',
    key: 'createdAt'
  },
  {
    title: '啟用狀態',
    key: 'isActive',
    render(row: UserResponse) {
      return h(NSwitch, {
        value: row.enabled,
        onUpdateValue: (value: boolean) => {
          dialog.warning({
            title: '確認操作',
            content: `確定要${value ? '啟用' : '停用'}帳號 ${row.username} 嗎？`,
            positiveText: '確認',
            negativeText: '取消',
            onPositiveClick: async () => {
              try {
                await toggleUserActive(row.id, value)
                row.enabled = value
                message.success(`帳號 ${row.username} 已 ${value ? '啟用' : '停用'}`)
              } catch (err) {
                message.error('切換狀態失敗')
              }
            }
          })
        }
      })
    }
  }
]

async function fetchUsers() {
  try {
    const res = await getAllUsers()
    users.value = res.data
  } catch (err) {
    message.error('無法載入使用者清單')
  }
}

onMounted(async () => {
  fetchUsers()
  const res = await getAllUsers()
  console.log(res.data)
  users.value = res.data
})
</script>
