<template>
  <n-layout-sider bordered width="200" collapse-mode="width">
    <n-menu v-model:value="activeKey" :options="menuOptions" @update:value="handleMenuClick" />
  </n-layout-sider>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { NLayoutSider, NMenu } from 'naive-ui'

const router = useRouter()
const activeKey = ref('dashboard')

const menuOptions = [
  {
    label: '儀表板',
    key: ''
  },
  {
    label: '商品管理',
    key: 'products'
  },
  {
    label: '分類管理',
    key: 'categories'
  },
  {
    label: '標籤管理',
    key: 'tags'
  },
  {
    label: '訂單管理',
    key: 'orders'
  },
  {
    label: '用戶管理',
    key: 'users'
  },
  {
    label: '設定',
    key: 'settings'
  }
]

function handleMenuClick(key: string) {
  activeKey.value = key
  router.push(`/admin/${key}`)
}
</script>
