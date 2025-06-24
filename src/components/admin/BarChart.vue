<template>
  <n-card title="月營收統計">
    <div ref="chartRef" style="height: 400px; width: 100%"></div>
  </n-card>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, nextTick } from 'vue'
import * as echarts from 'echarts'
import { NCard } from 'naive-ui'

interface BarChartPoint {
  name: string
  value: number
}

const props = defineProps<{
  data: BarChartPoint[]
}>()

const chartRef = ref<HTMLDivElement | null>(null)
let chartInstance: echarts.ECharts | null = null

function initChart() {
  if (!chartRef.value) return
  chartInstance = echarts.init(chartRef.value)

  const option = {
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: props.data.map(item => item.name)
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '營收',
        type: 'bar',
        data: props.data.map(item => item.value),
        itemStyle: {
          color: '#3b82f6'
        }
      }
    ]
  }

  chartInstance.setOption(option)
}

onMounted(() => {
  nextTick(initChart)
})

watch(
  () => props.data,
  () => {
    if (chartInstance && chartRef.value) {
      initChart()
    }
  },
  { deep: true }
)
</script>
