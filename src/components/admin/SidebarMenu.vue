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
    key: 'dashboard'
  },
  {
    label: '商品管理',
    key: 'products'
  }
]

function handleMenuClick(key: string) {
  activeKey.value = key
  router.push(`/admin/${key}`)
}
</script>
