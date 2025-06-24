<template>
  <n-form-item label="分類" path="categoryId">
    <n-select
      :value="modelValue"
      @update:value="val => emit('update:modelValue', val)"
      :options="options"
      :loading="loading"
      :disabled="disabled"
      clearable
      placeholder="請選擇分類"
    />
  </n-form-item>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NFormItem, NSelect } from 'naive-ui'
import type { CategoryResponse } from '@/types/categoryResponse'

/**
 * Props for CategorySelector
 * @prop categories - 所有可選的分類資料
 * @prop modelValue - 綁定的分類 ID
 * @prop loading - 是否顯示載入狀態
 * @prop disabled - 是否禁用選單
 */
const props = defineProps<{
  categories: CategoryResponse[]
  modelValue: number | null
  loading?: boolean
  disabled?: boolean
}>()

/**
 * Emits
 * @event update:modelValue - 回傳更新後的分類 ID
 */
const emit = defineEmits(['update:modelValue'])

const options = computed(
  () => props.categories?.map((c: CategoryResponse) => ({ label: c.name, value: c.id })) ?? []
)
</script>
