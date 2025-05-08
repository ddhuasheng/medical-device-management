<template>
  <div class="purchase-ledger-container">
    <!-- 搜索区域 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="合同编号">
          <el-input
            v-model="searchForm.contractNo"
            placeholder="请输入合同编号"
            clearable
          />
        </el-form-item>
        <el-form-item label="采购编号">
          <el-input
            v-model="searchForm.purchaseNo"
            placeholder="请输入采购编号"
            clearable
          />
        </el-form-item>
        <el-form-item label="采购时间">
          <el-date-picker
            v-model="searchForm.purchaseTimeRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="设备名称">
          <el-input
            v-model="searchForm.equipmentName"
            placeholder="请输入设备名称"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="statistics-row">
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

    <!-- 表格工具栏 -->
    <div class="table-toolbar">
      <el-button type="success" @click="handleExport">
        <el-icon><Download /></el-icon>导出台账
      </el-button>
      <el-button type="primary" @click="handlePrint">
        <el-icon><Printer /></el-icon>打印台账
      </el-button>
    </div>

    <!-- 表格区域 -->
    <el-card class="table-card">
      <el-table
        v-loading="loading"
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column prop="contractNo" label="合同编号" width="120" />
        <el-table-column prop="purchaseNo" label="采购编号" width="120" />
        <el-table-column prop="purchaseTime" label="采购时间" width="120" />
        <el-table-column prop="equipmentName" label="采购设备" width="150" />
        <el-table-column prop="warehouseName" label="仓库" width="100" />
        <el-table-column prop="departmentName" label="科室" width="100" />
        <el-table-column prop="quantity" label="采购数量" width="100" />
        <el-table-column prop="amount" label="采购金额" width="120">
          <template #default="scope">
            {{ formatCurrency(scope.row.amount) }}
          </template>
        </el-table-column>
        <el-table-column prop="model" label="设备型号" width="120" />
        <el-table-column prop="purchaser" label="采购人" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusLabel(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="invoiceVerified" label="发票核验" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.invoiceVerified ? 'success' : 'info'">
              {{ scope.row.invoiceVerified ? '已核验' : '未核验' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="acceptanceTime" label="验收时间" width="150" />
        <el-table-column prop="acceptancePerson" label="验收人" width="100" />
        <el-table-column label="操作" fixed="right" width="120">
          <template #default="scope">
            <el-button type="primary" link @click="handleView(scope.row)">
              查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 图表分析 -->
    <el-row :gutter="20" class="chart-row">
      <!-- 月度采购金额统计 -->
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>月度采购金额统计</span>
              <el-select
                v-model="yearSelected"
                placeholder="选择年份"
                style="width: 120px"
              >
                <el-option
                  v-for="item in yearOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
          </template>
          <div class="chart-container" ref="monthlyAmountChart"></div>
        </el-card>
      </el-col>

      <!-- 设备分类采购占比 -->
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>设备分类采购占比</span>
            </div>
          </template>
          <div class="chart-container" ref="categoryPieChart"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 查看详情对话框 -->
    <el-dialog title="采购详情" v-model="viewDialogVisible" width="700px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="合同编号">{{
          viewForm.contractNo
        }}</el-descriptions-item>
        <el-descriptions-item label="采购编号">{{
          viewForm.purchaseNo
        }}</el-descriptions-item>
        <el-descriptions-item label="采购时间">{{
          viewForm.purchaseTime
        }}</el-descriptions-item>
        <el-descriptions-item label="采购设备">{{
          viewForm.equipmentName
        }}</el-descriptions-item>
        <el-descriptions-item label="仓库">{{
          viewForm.warehouseName
        }}</el-descriptions-item>
        <el-descriptions-item label="科室">{{
          viewForm.departmentName
        }}</el-descriptions-item>
        <el-descriptions-item label="采购数量">{{
          viewForm.quantity
        }}</el-descriptions-item>
        <el-descriptions-item label="采购金额">{{
          formatCurrency(viewForm.amount)
        }}</el-descriptions-item>
        <el-descriptions-item label="设备型号">{{
          viewForm.model
        }}</el-descriptions-item>
        <el-descriptions-item label="采购人">{{
          viewForm.purchaser
        }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusType(viewForm.status)">
            {{ getStatusLabel(viewForm.status) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="发票核验">
          <el-tag :type="viewForm.invoiceVerified ? 'success' : 'info'">
            {{ viewForm.invoiceVerified ? '已核验' : '未核验' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="验收时间">{{
          viewForm.acceptanceTime || '暂无'
        }}</el-descriptions-item>
        <el-descriptions-item label="验收人">{{
          viewForm.acceptancePerson || '暂无'
        }}</el-descriptions-item>
        <el-descriptions-item label="规格文件" :span="2">
          <el-button
            type="primary"
            link
            @click="viewSpecFile(viewForm)"
            v-if="viewForm.specificationFile"
          >
            查看
          </el-button>
          <span v-else>未上传</span>
        </el-descriptions-item>
        <el-descriptions-item
          label="发票信息"
          :span="2"
          v-if="viewForm.invoiceVerified"
        >
          <div>发票号码：{{ viewForm.invoiceNo }}</div>
          <div>发票金额：{{ formatCurrency(viewForm.invoiceAmount) }}</div>
          <div>开票日期：{{ viewForm.invoiceDate }}</div>
          <div>核验人：{{ viewForm.verifier }}</div>
        </el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">{{
          viewForm.remark || '暂无'
        }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Download, Printer } from '@element-plus/icons-vue'
import * as echarts from 'echarts/core'
import { BarChart, PieChart } from 'echarts/charts'
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
  CanvasRenderer,
])

// 状态选项
const statusOptions = [
  { value: 'pending', label: '待审核' },
  { value: 'approved', label: '待验收' },
  { value: 'completed', label: '已完成' },
  { value: 'rejected', label: '驳回' },
]

// 获取状态标签类型
const getStatusType = (status) => {
  switch (status) {
    case 'pending':
      return 'warning'
    case 'approved':
      return 'primary'
    case 'completed':
      return 'success'
    case 'rejected':
      return 'danger'
    default:
      return 'info'
  }
}

// 获取状态标签文本
const getStatusLabel = (status) => {
  const found = statusOptions.find((item) => item.value === status)
  return found ? found.label : status
}

// 格式化货币
const formatCurrency = (value) => {
  return `¥ ${Number(value).toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

// 搜索表单
const searchForm = reactive({
  contractNo: '',
  purchaseNo: '',
  purchaseTimeRange: [],
  equipmentName: '',
})

// 重置搜索
const resetSearch = () => {
  searchForm.contractNo = ''
  searchForm.purchaseNo = ''
  searchForm.purchaseTimeRange = []
  searchForm.equipmentName = ''
  handleSearch()
}

// 处理搜索
const handleSearch = () => {
  currentPage.value = 1
  fetchData()
}

// 统计卡片数据
const statisticsData = reactive([
  {
    title: '采购总金额',
    value: '¥ 2,950,000.00',
    icon: 'Money',
    color: '#409EFF',
  },
  {
    title: '采购总数量',
    value: '11',
    icon: 'ShoppingCart',
    color: '#67C23A',
  },
  {
    title: '待验收',
    value: '2',
    icon: 'Document',
    color: '#E6A23C',
  },
  {
    title: '已完成',
    value: '8',
    icon: 'CircleCheck',
    color: '#67C23A',
  },
])

// 表格数据
const loading = ref(false)
const tableData = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 模拟获取数据
const fetchData = () => {
  loading.value = true
  // 这里应该是调用API获取数据
  setTimeout(() => {
    // 模拟数据
    const mockData = [
      {
        id: 1,
        contractNo: 'HT20230001',
        purchaseNo: 'CG20230001',
        purchaseTime: '2023-06-15',
        equipmentName: 'CT扫描仪',
        equipmentId: 1,
        warehouseName: '医疗设备仓库',
        warehouseId: 1,
        departmentName: '放射科',
        departmentId: 1,
        quantity: 1,
        amount: 1500000,
        model: 'CT-X100',
        purchaser: '张三',
        status: 'completed',
        invoiceVerified: true,
        acceptanceTime: '2023-07-01 10:30:00',
        acceptancePerson: '李四',
        specificationFile: 'spec1.pdf',
        invoiceNo: 'FP20230001',
        invoiceAmount: 1500000,
        invoiceDate: '2023-06-20',
        verifier: '王五',
        remark: '高端CT设备采购',
      },
      {
        id: 2,
        contractNo: 'HT20230002',
        purchaseNo: 'CG20230002',
        purchaseTime: '2023-06-20',
        equipmentName: '呼吸机',
        equipmentId: 2,
        warehouseName: '医疗设备仓库',
        warehouseId: 1,
        departmentName: '重症医学科',
        departmentId: 2,
        quantity: 5,
        amount: 500000,
        model: 'HX-2000',
        purchaser: '李四',
        status: 'approved',
        invoiceVerified: false,
        acceptanceTime: '',
        acceptancePerson: '',
        specificationFile: 'spec2.pdf',
        remark: '重症科室呼吸机更新',
      },
      {
        id: 3,
        contractNo: 'HT20230003',
        purchaseNo: 'CG20230003',
        purchaseTime: '2023-07-05',
        equipmentName: '心电图机',
        equipmentId: 3,
        warehouseName: '医疗设备仓库',
        warehouseId: 1,
        departmentName: '心内科',
        departmentId: 3,
        quantity: 3,
        amount: 150000,
        model: 'ECG-300',
        purchaser: '王五',
        status: 'completed',
        invoiceVerified: true,
        acceptanceTime: '2023-07-20 14:30:00',
        acceptancePerson: '赵六',
        specificationFile: 'spec3.pdf',
        invoiceNo: 'FP20230003',
        invoiceAmount: 150000,
        invoiceDate: '2023-07-10',
        verifier: '张三',
        remark: '心内科常规设备更新',
      },
      {
        id: 4,
        contractNo: 'HT20230004',
        purchaseNo: 'CG20230004',
        purchaseTime: '2023-07-10',
        equipmentName: '超声波仪',
        equipmentId: 4,
        warehouseName: '医疗设备仓库',
        warehouseId: 1,
        departmentName: '妇产科',
        departmentId: 4,
        quantity: 2,
        amount: 800000,
        model: 'US-500',
        purchaser: '赵六',
        status: 'completed',
        invoiceVerified: true,
        acceptanceTime: '2023-07-25 09:30:00',
        acceptancePerson: '张三',
        specificationFile: 'spec4.pdf',
        invoiceNo: 'FP20230004',
        invoiceAmount: 800000,
        invoiceDate: '2023-07-15',
        verifier: '李四',
        remark: '妇产科超声波设备更新',
      },
    ]

    // 过滤数据
    let filteredData = [...mockData]
    if (searchForm.contractNo) {
      filteredData = filteredData.filter((item) =>
        item.contractNo.includes(searchForm.contractNo)
      )
    }
    if (searchForm.purchaseNo) {
      filteredData = filteredData.filter((item) =>
        item.purchaseNo.includes(searchForm.purchaseNo)
      )
    }
    if (
      searchForm.purchaseTimeRange &&
      searchForm.purchaseTimeRange.length === 2
    ) {
      const startDate = searchForm.purchaseTimeRange[0]
      const endDate = searchForm.purchaseTimeRange[1]
      filteredData = filteredData.filter((item) => {
        return item.purchaseTime >= startDate && item.purchaseTime <= endDate
      })
    }
    if (searchForm.equipmentName) {
      filteredData = filteredData.filter((item) =>
        item.equipmentName.includes(searchForm.equipmentName)
      )
    }

    // 分页
    total.value = filteredData.length
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    tableData.value = filteredData.slice(start, end)
    loading.value = false
  }, 500)
}

// 处理分页大小变化
const handleSizeChange = (size) => {
  pageSize.value = size
  fetchData()
}

// 处理页码变化
const handleCurrentChange = (page) => {
  currentPage.value = page
  fetchData()
}

// 查看详情对话框
const viewDialogVisible = ref(false)
const viewForm = reactive({
  id: null,
  contractNo: '',
  purchaseNo: '',
  purchaseTime: '',
  equipmentName: '',
  warehouseName: '',
  departmentName: '',
  quantity: 0,
  amount: 0,
  model: '',
  purchaser: '',
  status: '',
  invoiceVerified: false,
  acceptanceTime: '',
  acceptancePerson: '',
  specificationFile: null,
  invoiceNo: '',
  invoiceAmount: 0,
  invoiceDate: '',
  verifier: '',
  remark: '',
})

// 处理查看详情
const handleView = (row) => {
  Object.assign(viewForm, row)
  viewDialogVisible.value = true
}

// 查看规格文件
const viewSpecFile = (row) => {
  // 这里应该是调用API获取文件并预览
  ElMessage.info('查看规格文件：' + row.specificationFile)
}

// 处理导出
const handleExport = () => {
  ElMessage.success('导出成功')
}

// 处理打印
const handlePrint = () => {
  ElMessage.success('打印成功')
}

// 图表相关
const monthlyAmountChart = ref(null)
const categoryPieChart = ref(null)
const yearSelected = ref('2023')
const yearOptions = [
  { value: '2023', label: '2023年' },
  { value: '2022', label: '2022年' },
  { value: '2021', label: '2021年' },
]

// 初始化月度采购金额图表
const initMonthlyAmountChart = () => {
  const chartDom = monthlyAmountChart.value
  const myChart = echarts.init(chartDom)
  const option = {
    title: {
      text: '月度采购金额统计',
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      formatter: function (params) {
        const data = params[0]
        return `${data.name}月: ${formatCurrency(data.value)}`
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: [
        '1月',
        '2月',
        '3月',
        '4月',
        '5月',
        '6月',
        '7月',
        '8月',
        '9月',
        '10月',
        '11月',
        '12月',
      ],
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: function (value) {
          return value / 10000 + '万'
        },
      },
    },
    series: [
      {
        name: '采购金额',
        type: 'bar',
        barWidth: '60%',
        data: [
          150000, 230000, 180000, 320000, 250000, 350000, 450000, 280000,
          320000, 190000, 230000, 200000,
        ],
        itemStyle: {
          color: '#409EFF',
        },
      },
    ],
  }
  myChart.setOption(option)

  // 监听窗口大小变化，调整图表大小
  window.addEventListener('resize', function () {
    myChart.resize()
  })
}

// 初始化设备分类采购占比图表
const initCategoryPieChart = () => {
  const chartDom = categoryPieChart.value
  const myChart = echarts.init(chartDom)
  const option = {
    title: {
      text: '设备分类采购占比',
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
      formatter: function (params) {
        return `${params.name}: ${formatCurrency(params.value)} (${
          params.percent
        }%)`
      },
    },
    legend: {
      orient: 'vertical',
      left: 'left',
    },
    series: [
      {
        name: '采购金额',
        type: 'pie',
        radius: '50%',
        data: [
          { value: 1500000, name: '影像设备' },
          { value: 500000, name: '生命支持设备' },
          { value: 150000, name: '诊断设备' },
          { value: 800000, name: '治疗设备' },
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
  }
  myChart.setOption(option)

  // 监听窗口大小变化，调整图表大小
  window.addEventListener('resize', function () {
    myChart.resize()
  })
}

onMounted(() => {
  fetchData()
  // 初始化图表
  setTimeout(() => {
    initMonthlyAmountChart()
    initCategoryPieChart()
  }, 500)
})
</script>

<style scoped>
.purchase-ledger-container {
  padding: 20px;
}

.search-card {
  margin-bottom: 20px;
}

.statistics-row {
  margin-bottom: 20px;
}

.statistics-card {
  margin-bottom: 20px;
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

.card-icon .el-icon {
  font-size: 30px;
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

.table-toolbar {
  margin-bottom: 20px;
  display: flex;
  justify-content: flex-start;
  gap: 10px;
}

.table-card {
  margin-bottom: 20px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.chart-row {
  margin-bottom: 20px;
}

.chart-card {
  margin-bottom: 20px;
}

.chart-container {
  height: 400px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
