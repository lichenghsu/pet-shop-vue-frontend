<template>
  <div class="login-page">
    <h2>會員登入</h2>
    <form @submit.prevent="handleLogin" class="form">
      <input v-model="form.username" type="username" placeholder="username" required />
      <input v-model="form.password" type="password" placeholder="Password" required />
      <button type="submit" :disabled="loading">登入</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/useAuthStore'
import { useRouter } from 'vue-router'
import { login } from '@/api/auth'
import type { LoginRequest } from '@/api/auth'

const router = useRouter()
const form = ref<LoginRequest>({ username: '', password: '' })
const auth = useAuthStore()
const error = ref('')
const loading = ref(false)

const handleLogin = async () => {
  try {
    const { data } = await login(form.value)
    auth.login(data.token)
    router.push('/admin')
  } catch (err: any) {
    error.value = err.response?.data?.message || '登入失敗'
  }
}
</script>

<style scoped>
.login-page {
  max-width: 400px;
  margin: 60px auto;
  text-align: center;
}
.form input {
  display: block;
  width: 100%;
  margin: 12px 0;
  padding: 8px;
}
.error {
  color: red;
  margin-top: 10px;
}
</style>
