<template>
  <n-layout-header
    bordered
    style="padding: 12px; display: flex; justify-content: space-between; align-items: center"
  >
    <div>
      <span class="text-lg font-bold">後台管理系統</span>
    </div>
    <div style="align-items: right">
      <span v-if="auth.isAuthenticated">
        👋 Hi {{ auth.user?.username || '使用者' }}
        <n-button size="small" type="primary" @click="handleLogout"> 登出 </n-button>
      </span>
      <span v-else>
        <router-link to="/login">登入</router-link>
      </span>
    </div>
  </n-layout-header>
</template>

<script lang="ts" setup>
import { NLayoutHeader } from 'naive-ui'
import { useAuthStore } from '@/stores/useAuthStore'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

function handleLogout() {
  auth.logout()
  router.push('/login')
}
</script>

<style scoped>
.text-lg {
  font-size: 1.125rem;
}

.font-bold {
  font-weight: bold;
}
</style>
