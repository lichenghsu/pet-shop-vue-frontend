<template>
  <div v-if="auth.isAuthenticated" class="grid gap-4 grid-cols-1 md:grid-cols-3">
    <div class="grid gap-4 grid-cols-1 md:grid-cols-3">
      <n-card title="商品總數">
        <p class="text-2xl font-bold">{{ stats.productCount }}</p>
      </n-card>

      <n-card title="註冊會員">
        <p class="text-2xl font-bold">{{ stats.userCount }}</p>
      </n-card>

      <n-card title="總訂單金額">
        <p class="text-2xl font-bold">${{ stats.totalOrderAmount.toLocaleString() }}</p>
      </n-card>
    </div>

    <n-card title="每月營收" style="margin-top: 2rem">
      <BarChart :data="barChartData" />
    </n-card>
  </div>

  <div v-else class="text-center text-gray-500 mt-8">請先登入以檢視儀表板。</div>

  <GithubRepo />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useMessage, NCard } from 'naive-ui'
import { useAuthStore } from '@/stores/useAuthStore'
import { getDashboardStats } from '@/api/dashboard'
import type { DashboardResponse } from '@/types/dashboardResponse'
import BarChart from '@/components/admin/BarChart.vue'
import GithubRepo from '@/components/admin/GithubRepo.vue'

const auth = useAuthStore()
const message = useMessage()

const stats = ref<DashboardResponse>({
  productCount: 0,
  userCount: 0,
  totalOrderAmount: 0,
  monthlyRevenue: []
})

const barChartData = ref<{ name: string; value: number }[]>([])

onMounted(async () => {
  if (!auth.isAuthenticated) {
    message.error('請先登入後台管理系統')
    return
  }
  try {
    const res = await getDashboardStats()
    stats.value = res.data

    barChartData.value = stats.value.monthlyRevenue.map(item => ({
      name: item.month,
      value: item.total
    }))
  } catch (err) {
    console.error('載入 Dashboard 資料失敗', err)
    message.error('載入 Dashboard 資料失敗')
  }
})
</script>
