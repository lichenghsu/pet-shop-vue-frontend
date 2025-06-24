<template>
  <n-space vertical size="large" style="width: 100%">
    <n-space justify="space-between" align="center">
      <n-h2>訂單管理</n-h2>
      <n-space align="center">
        <n-select
          v-model:value="selectedStatus"
          :options="statusOptions"
          placeholder="選擇新狀態"
          style="width: 180px"
        />
        <n-button type="primary" :disabled="selectedOrderIds.length === 0" @click="updateStatuses">
          批次更新狀態
        </n-button>
      </n-space>
    </n-space>

    <n-data-table
      :columns="columns"
      :data="orders"
      :row-key="getRowKey"
      checkable
      :checked-row-keys="selectedOrderIds"
      @update:checked-row-keys="handleCheckChange"
      :pagination="{ pageSize: 10 }"
    />
  </n-space>
  <n-modal v-model:show="showViewModal" title="訂單詳情" preset="dialog">
    <div v-if="selectedOrder">
      <p>訂單編號：{{ selectedOrder.id }}</p>
      <p>建立時間：{{ selectedOrder.createdAt }}</p>
      <p>用戶名稱：{{ selectedOrder.username }}（{{ selectedOrder.email }}）</p>
      <p>狀態：{{ selectedOrder.status }}</p>
      <br />
      <div>訂單商品</div>
      <n-ul>
        <li v-for="item in selectedOrder.items" :key="item.productName">
          {{ item.productName }} x{{ item.quantity }} (${{ item.price }})
        </li>
      </n-ul>
    </div>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, onMounted, h } from 'vue'
import { useMessage, NTag, NSelect, NButton, NCheckbox, type DataTableColumns } from 'naive-ui'
import {
  getAllAdminOrderResponses,
  updateOrderStatuses,
  cancelAdminOrder,
  getAdminOrderResponseById
} from '@/api/adminOrder'
import { type AdminOrderResponse } from '@/types/adminOrderResponse'

const message = useMessage()
const orders = ref<AdminOrderResponse[]>([])
const selectedOrderIds = ref<number[]>([])
const selectedStatus = ref<string | null>(null)
const selectedOrder = ref<AdminOrderResponse | null>(null)
const showViewModal = ref(false)
const getRowKey: (row: AdminOrderResponse) => number = row => row.id

const statusOptions = [
  { label: '待處理', value: 'PENDING' },
  { label: '已出貨', value: 'SHIPPED' },
  { label: '已送達', value: 'DELIVERED' },
  { label: '已取消', value: 'CANCELLED' }
]

const statusLabelMap: Record<string, string> = {
  PENDING: '待處理',
  SHIPPED: '已出貨',
  DELIVERED: '已送達',
  CANCELLED: '已取消'
}

const columns: DataTableColumns<AdminOrderResponse> = [
  {
    title: '',
    key: 'select',
    width: 48,
    render(row) {
      return h(NCheckbox, {
        checked: selectedOrderIds.value.includes(row.id),
        onUpdateChecked: (checked: boolean) => {
          if (checked) {
            selectedOrderIds.value.push(row.id)
          } else {
            selectedOrderIds.value = selectedOrderIds.value.filter(id => id !== row.id)
          }
        }
      })
    }
  },
  { title: '訂單 ID', key: 'id' },
  { title: '建立時間', key: 'createdAt' },
  {
    title: '狀態',
    key: 'status',
    render(row) {
      const statusColorMap: Record<string, 'info' | 'success' | 'warning' | 'error'> = {
        PENDING: 'warning',
        SHIPPED: 'info',
        DELIVERED: 'success',
        CANCELLED: 'error'
      }
      return h(
        NTag,
        { type: statusColorMap[row.status] || 'default', size: 'small', bordered: false },
        { default: () => statusLabelMap[row.status] || row.status }
      )
    }
  },
  {
    title: '商品清單',
    key: 'items',
    render(row) {
      return row.items
        .map(item => `${item.productName} x${item.quantity} ($${item.price})`)
        .join(', ')
    }
  },
  {
    title: '操作',
    key: 'actions',
    render(row) {
      return h('div', { style: 'display: flex; gap: 8px;' }, [
        h(
          NButton,
          {
            size: 'small',
            onClick: () => openViewModal(row.id)
          },
          { default: () => '檢視' }
        ),
        h(
          NButton,
          {
            size: 'small',
            type: 'error',
            disabled: row.status !== 'PENDING' && row.status !== 'PAID',
            onClick: () => handleCancel(row.id)
          },
          { default: () => '取消訂單' }
        )
      ])
    }
  }
]

function handleCheckChange(keys: number[]) {
  selectedOrderIds.value = keys
}

async function fetchOrders() {
  try {
    const res = await getAllAdminOrderResponses()
    orders.value = res.data
  } catch (err) {
    message.error('載入訂單失敗')
  }
}

async function updateStatuses() {
  if (!selectedStatus.value) {
    message.warning('請選擇狀態')
    return
  }
  try {
    await updateOrderStatuses({ orderIds: selectedOrderIds.value, status: selectedStatus.value })
    message.success('訂單狀態更新成功')
    await fetchOrders()
    selectedOrderIds.value = []
    selectedStatus.value = null
  } catch (err) {
    message.error('更新失敗')
  }
}

async function handleCancel(orderId: number) {
  try {
    await cancelAdminOrder(orderId)
    message.success('訂單已取消')
    await fetchOrders()
  } catch (err) {
    message.error('取消失敗')
    console.error('取消訂單失敗:', err)
  }
}

async function openViewModal(orderId: number) {
  try {
    const res = await getAdminOrderResponseById(orderId)
    selectedOrder.value = res.data
    showViewModal.value = true
  } catch (err) {
    message.error('取得訂單詳情失敗')
  }
}

onMounted(fetchOrders)
</script>
