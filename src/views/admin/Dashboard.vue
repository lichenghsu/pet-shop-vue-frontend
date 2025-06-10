<template>
  <div class="grid gap-4 grid-cols-1 md:grid-cols-3">
    <n-card title="商品總數">
      <p class="text-2xl font-bold">{{ stats.products }}</p>
    </n-card>

    <n-card title="註冊會員">
      <p class="text-2xl font-bold">{{ stats.users }}</p>
    </n-card>

    <n-card title="總訂單金額">
      <p class="text-2xl font-bold">${{ stats.revenue.toLocaleString() }}</p>
    </n-card>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { NCard } from 'naive-ui'

// 假資料
const stats = reactive({
  products: 128,
  users: 54,
  revenue: 93214
})
</script>

<style scoped>
.text-2xl {
  font-size: 1.5rem;
}

.font-bold {
  font-weight: bold;
}

.grid {
  display: grid;
}

.gap-4 {
  gap: 1rem;
}

.grid-cols-1 {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}

.md\:grid-cols-3 {

  /* Tailwind */
  @media (min-width: 768px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
