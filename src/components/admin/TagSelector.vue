<template>
  <n-form-item label="標籤" path="tagIds">
    <n-select
      :value="modelValue"
      @update:value="val => emit('update:modelValue', val)"
      multiple
      :options="options"
      :loading="loading"
      :disabled="disabled"
      clearable
      placeholder="請選擇標籤"
    />
  </n-form-item>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NFormItem, NSelect } from 'naive-ui'
import type { TagResponse } from '@/types/tagResponse'

/**
 * Props for TagSelector
 * @prop tags - 所有可選的標籤資料
 * @prop modelValue - 綁定的標籤 ID 陣列
 * @prop loading - 是否顯示載入狀態
 * @prop disabled - 是否禁用選單
 */
const props = defineProps<{
  tags: TagResponse[]
  modelValue: number[]
  loading?: boolean
  disabled?: boolean
}>()

/**
 * Emits
 * @event update:modelValue - 回傳更新後的標籤 ID 陣列
 */
const emit = defineEmits(['update:modelValue'])

const options = computed(
  () => props.tags?.map((t: TagResponse) => ({ label: t.name, value: t.id })) ?? []
)
</script>
