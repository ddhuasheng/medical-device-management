<template>
  <div class="dashboard-container">
    <el-row :gutter="20">
      <!-- 统计卡片 -->
      <el-col
        :xs="24"
        :sm="12"
        :md="12"
        :lg="6"
        :xl="6"
        v-for="(item, index) in statisticsData"
        :key="index"
      >
        <el-card class="statistics-card" :body-style="{ padding: '20px' }">
          <div class="card-content">
            <div class="card-icon" :style="{ backgroundColor: item.color }">
              <el-icon>
                <component :is="item.icon"></component>
              </el-icon>
            </div>
            <div class="card-info">
              <div class="card-title">{{ item.title }}</div>
              <div class="card-value">{{ item.value }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="chart-row">
      <!-- 设备分类统计 -->
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>设备分类统计</span>
            </div>
          </template>
          <div class="chart-container" ref="equipmentCategoryChart"></div>
        </el-card>
      </el-col>

      <!-- 设备状态统计 -->
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>设备状态统计</span>
            </div>
          </template>
          <div class="chart-container" ref="equipmentStatusChart"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="chart-row">
      <!-- 近期维修任务 -->
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>近期维修任务</span>
              <el-button type="primary" text>查看更多</el-button>
            </div>
          </template>
          <el-table :data="repairTasks" style="width: 100%">
            <el-table-column prop="id" label="任务编号" width="100" />
            <el-table-column prop="equipment" label="设备名称" width="120" />
            <el-table-column prop="department" label="报修科室" width="120" />
            <el-table-column prop="date" label="报修时间" width="180" />
            <el-table-column prop="status" label="状态">
              <template #default="scope">
                <el-tag :type="getStatusType(scope.row.status)">{{
                  scope.row.status
                }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <!-- 科室设备利用率 -->
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>科室设备利用率</span>
            </div>
          </template>
          <div class="chart-container" ref="departmentUsageChart"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import * as echarts from 'echarts/core'
import { BarChart, PieChart, LineChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

// 注册必要的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  BarChart,
  PieChart,
  LineChart,
  CanvasRenderer,
])

// 统计卡片数据
const statisticsData = reactive([
  {
    title: '设备总数',
    value: '1,286',
    icon: 'Monitor',
    color: '#409EFF',
  },
  {
    title: '维修任务',
    value: '32',
    icon: 'Tools',
    color: '#F56C6C',
  },
  {
    title: '借调设备',
    value: '48',
    icon: 'Connection',
    color: '#E6A23C',
  },
  {
    title: '待验收',
    value: '12',
    icon: 'Document',
    color: '#67C23A',
  },
])

// 近期维修任务数据
const repairTasks = reactive([
  {
    id: 'WX2023001',
    equipment: 'CT扫描仪',
    department: '放射科',
    date: '2023-06-15 09:30:00',
    status: '待处理',
  },
  {
    id: 'WX2023002',
    equipment: '呼吸机',
    department: '重症医学科',
    date: '2023-06-14 14:20:00',
    status: '处理中',
  },
  {
    id: 'WX2023003',
    equipment: '心电图机',
    department: '心内科',
    date: '2023-06-13 11:15:00',
    status: '已完成',
  },
  {
    id: 'WX2023004',
    equipment: '超声波仪',
    department: '妇产科',
    date: '2023-06-12 16:45:00',
    status: '已完成',
  },
])

// 状态标签类型
const getStatusType = (status) => {
  switch (status) {
    case '待处理':
      return 'warning'
    case '处理中':
      return 'primary'
    case '已完成':
      return 'success'
    default:
      return 'info'
  }
}

// 图表引用
const equipmentCategoryChart = ref(null)
const equipmentStatusChart = ref(null)
const departmentUsageChart = ref(null)

// 初始化图表
onMounted(() => {
  // 设备分类统计图表
  const categoryChart = echarts.init(equipmentCategoryChart.value)
  categoryChart.setOption({
    title: {
      text: '设备分类统计',
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: [
        '医学影像设备',
        '检验设备',
        '治疗设备',
        '监护设备',
        '手术设备',
        '其他设备',
      ],
    },
    series: [
      {
        name: '设备分类',
        type: 'pie',
        radius: '60%',
        center: ['50%', '60%'],
        data: [
          { value: 335, name: '医学影像设备' },
          { value: 310, name: '检验设备' },
          { value: 234, name: '治疗设备' },
          { value: 135, name: '监护设备' },
          { value: 154, name: '手术设备' },
          { value: 118, name: '其他设备' },
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

  // 设备状态统计图表
  const statusChart = echarts.init(equipmentStatusChart.value)
  statusChart.setOption({
    title: {
      text: '设备状态统计',
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        data: ['在用', '闲置', '维修中', '报废', '借出'],
        axisTick: {
          alignWithLabel: true,
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
      },
    ],
    series: [
      {
        name: '设备数量',
        type: 'bar',
        barWidth: '60%',
        data: [820, 120, 32, 45, 48],
        itemStyle: {
          color: function (params) {
            const colorList = [
              '#67C23A',
              '#909399',
              '#F56C6C',
              '#909399',
              '#E6A23C',
            ]
            return colorList[params.dataIndex]
          },
        },
      },
    ],
  })

  // 科室设备利用率图表
  const usageChart = echarts.init(departmentUsageChart.value)
  usageChart.setOption({
    title: {
      text: '科室设备利用率',
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'value',
      boundaryGap: [0, 0.01],
      axisLabel: {
        formatter: '{value}%',
      },
    },
    yAxis: {
      type: 'category',
      data: [
        '放射科',
        '检验科',
        '手术室',
        '重症医学科',
        '心内科',
        '妇产科',
        '儿科',
      ],
    },
    series: [
      {
        name: '设备利用率',
        type: 'bar',
        data: [92, 85, 78, 75, 68, 62, 58],
        itemStyle: {
          color: function (params) {
            const value = params.value
            if (value > 85) return '#67C23A'
            if (value > 70) return '#409EFF'
            if (value > 60) return '#E6A23C'
            return '#F56C6C'
          },
        },
      },
    ],
  })

  // 监听窗口大小变化，调整图表大小
  window.addEventListener('resize', () => {
    categoryChart.resize()
    statusChart.resize()
    usageChart.resize()
  })
})
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
}

.statistics-card {
  margin-bottom: 20px;
  height: 120px;
}

.card-content {
  display: flex;
  align-items: center;
}

.card-icon {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 15px;
}

.card-icon :deep(svg) {
  width: 30px;
  height: 30px;
  color: white;
}

.card-info {
  flex: 1;
}

.card-title {
  font-size: 14px;
  color: #909399;
  margin-bottom: 8px;
}

.card-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}

.chart-row {
  margin-bottom: 20px;
}

.chart-card {
  height: 400px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-container {
  height: 320px;
}
</style>
