<template>
  <div class="loan-statistics-container">
    <el-card class="filter-card">
      <div class="filter-wrapper">
        <span class="filter-label">统计时段：</span>
        <el-date-picker
          v-model="timeRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD"
          @change="fetchData"
        />
      </div>
    </el-card>

    <el-row :gutter="20" class="chart-row">
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>科室设备利用率排行</span>
            </div>
          </template>
          <div class="chart-container" ref="utilizationChart"></div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>设备类型分布</span>
            </div>
          </template>
          <div class="chart-container" ref="typeDistributionChart"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts/core'
import { BarChart, PieChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

// 注册必要组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BarChart,
  PieChart,
  CanvasRenderer,
])

const timeRange = ref([])
const utilizationChart = ref(null)
const typeDistributionChart = ref(null)

let utilizationInstance = null
let distributionInstance = null

// 初始化图表
const initCharts = () => {
  utilizationInstance = echarts.init(utilizationChart.value)
  distributionInstance = echarts.init(typeDistributionChart.value)

  // 科室利用率柱状图配置
  utilizationInstance.setOption({
    title: {
      text: '科室设备利用率排行',
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    xAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value}%',
      },
    },
    yAxis: {
      type: 'category',
      data: ['放射科', '检验科', '手术室', 'ICU', '心内科', '妇产科', '儿科'],
    },
    series: [
      {
        name: '利用率',
        type: 'bar',
        data: [85, 78, 92, 88, 75, 80, 68],
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: '#83bff6' },
            { offset: 0.5, color: '#188df0' },
            { offset: 1, color: '#188df0' },
          ]),
        },
      },
    ],
  })

  // 设备类型分布饼图配置
  distributionInstance.setOption({
    title: {
      text: '设备类型分布',
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c}台 ({d}%)',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
    },
    series: [
      {
        name: '设备类型',
        type: 'pie',
        radius: '50%',
        data: [
          { value: 154, name: '影像设备' },
          { value: 234, name: '检验设备' },
          { value: 135, name: '治疗设备' },
          { value: 98, name: '监护设备' },
          { value: 65, name: '其他设备' },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  })
}

// 获取数据（模拟API调用）
const fetchData = async () => {
  // TODO: 实际对接后端API
  console.log('获取数据时间段:', timeRange.value)
}

// 处理窗口大小变化
const handleResize = () => {
  utilizationInstance?.resize()
  distributionInstance?.resize()
}

onMounted(() => {
  initCharts()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  utilizationInstance?.dispose()
  distributionInstance?.dispose()
})
</script>

<style scoped>
.loan-statistics-container {
  padding: 20px;
  width: 1000px;
}

.filter-card {
  margin-bottom: 20px;
}

.filter-wrapper {
  display: flex;
  align-items: center;
}

.filter-label {
  font-size: 14px;
  margin-right: 15px;
}

.chart-card {
  margin-bottom: 20px;
  min-height: 400px;
}

.chart-container {
  width: 100%;
  height: 400px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
