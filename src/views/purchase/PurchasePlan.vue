<template>
  <div class="purchase-plan-container">
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
        <el-form-item label="状态">
          <el-select
            v-model="searchForm.status"
            placeholder="请选择状态"
            clearable
          >
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格工具栏 -->
    <div class="table-toolbar">
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>新增采购计划
      </el-button>
      <el-button
        type="danger"
        :disabled="!selectedRows.length"
        @click="handleBatchDelete"
      >
        <el-icon><Delete /></el-icon>批量删除
      </el-button>
      <el-button type="success" @click="handleExport">
        <el-icon><Download /></el-icon>导出
      </el-button>
    </div>

    <!-- 表格区域 -->
    <el-card class="table-card">
      <el-table
        v-loading="loading"
        :data="tableData"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
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
        <el-table-column label="操作" fixed="right" width="220">
          <template #default="scope">
            <el-button type="primary" link @click="handleView(scope.row)">
              查看
            </el-button>
            <el-button
              type="primary"
              link
              @click="handleEdit(scope.row)"
              v-if="['pending', 'rejected'].includes(scope.row.status)"
            >
              编辑
            </el-button>
            <el-button
              type="primary"
              link
              @click="handleApprove(scope.row)"
              v-if="scope.row.status === 'pending'"
            >
              审核
            </el-button>
            <el-button
              type="primary"
              link
              @click="handleAcceptance(scope.row)"
              v-if="scope.row.status === 'approved'"
            >
              验收
            </el-button>
            <el-button
              type="primary"
              link
              @click="handleInvoice(scope.row)"
              v-if="
                scope.row.status === 'completed' && !scope.row.invoiceVerified
              "
            >
              发票核验
            </el-button>
            <el-button
              type="danger"
              link
              @click="handleDelete(scope.row)"
              v-if="['pending', 'rejected'].includes(scope.row.status)"
            >
              删除
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

    <!-- 新增/编辑对话框 -->
    <el-dialog
      :title="dialogType === 'add' ? '新增采购计划' : '编辑采购计划'"
      v-model="dialogVisible"
      width="700px"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="合同编号" prop="contractNo">
              <el-input
                v-model="form.contractNo"
                placeholder="请输入合同编号"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="采购编号" prop="purchaseNo">
              <el-input
                v-model="form.purchaseNo"
                placeholder="请输入采购编号"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="采购时间" prop="purchaseTime">
              <el-date-picker
                v-model="form.purchaseTime"
                type="date"
                placeholder="选择采购时间"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="采购设备" prop="equipmentId">
              <el-select
                v-model="form.equipmentId"
                placeholder="请选择采购设备"
                filterable
              >
                <el-option
                  v-for="item in equipmentOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="仓库" prop="warehouseId">
              <el-select
                v-model="form.warehouseId"
                placeholder="请选择仓库"
                filterable
              >
                <el-option
                  v-for="item in warehouseOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="科室" prop="departmentId">
              <el-select
                v-model="form.departmentId"
                placeholder="请选择科室"
                filterable
              >
                <el-option
                  v-for="item in departmentOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="采购数量" prop="quantity">
              <el-input-number
                v-model="form.quantity"
                :min="1"
                :precision="0"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="采购金额" prop="amount">
              <el-input-number
                v-model="form.amount"
                :min="0"
                :precision="2"
                :step="100"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="设备型号" prop="model">
              <el-input v-model="form.model" placeholder="请输入设备型号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="采购人" prop="purchaser">
              <el-input v-model="form.purchaser" placeholder="请输入采购人" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="规格文件" prop="specificationFile">
          <el-upload
            class="upload-demo"
            action="#"
            :auto-upload="false"
            :on-change="handleFileChange"
            :limit="1"
          >
            <template #trigger>
              <el-button type="primary">选择文件</el-button>
            </template>
            <template #tip>
              <div class="el-upload__tip">
                请上传采购产品规格文件，支持PDF、Word、Excel格式
              </div>
            </template>
          </el-upload>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            placeholder="请输入备注信息"
            :rows="3"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 审核对话框 -->
    <el-dialog
      title="采购计划审核"
      v-model="approveDialogVisible"
      width="500px"
    >
      <el-form
        ref="approveFormRef"
        :model="approveForm"
        :rules="approveRules"
        label-width="80px"
      >
        <el-form-item label="审核结果" prop="approveResult">
          <el-radio-group v-model="approveForm.approveResult">
            <el-radio :label="'approved'">通过</el-radio>
            <el-radio :label="'rejected'">驳回</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审核意见" prop="approveComment">
          <el-input
            v-model="approveForm.approveComment"
            type="textarea"
            placeholder="请输入审核意见"
            :rows="3"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="approveDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitApprove">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 验收对话框 -->
    <el-dialog title="采购验收" v-model="acceptanceDialogVisible" width="500px">
      <el-form
        ref="acceptanceFormRef"
        :model="acceptanceForm"
        :rules="acceptanceRules"
        label-width="100px"
      >
        <el-form-item label="验收结果" prop="acceptanceResult">
          <el-radio-group v-model="acceptanceForm.acceptanceResult">
            <el-radio :label="'completed'">通过</el-radio>
            <el-radio :label="'rejected'">不通过</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="验收人" prop="acceptancePerson">
          <el-input
            v-model="acceptanceForm.acceptancePerson"
            placeholder="请输入验收人"
          />
        </el-form-item>
        <el-form-item label="验收时间" prop="acceptanceTime">
          <el-date-picker
            v-model="acceptanceForm.acceptanceTime"
            type="datetime"
            placeholder="选择验收时间"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="验收意见" prop="acceptanceComment">
          <el-input
            v-model="acceptanceForm.acceptanceComment"
            type="textarea"
            placeholder="请输入验收意见"
            :rows="3"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="acceptanceDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitAcceptance">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 发票核验对话框 -->
    <el-dialog title="发票核验" v-model="invoiceDialogVisible" width="500px">
      <el-form
        ref="invoiceFormRef"
        :model="invoiceForm"
        :rules="invoiceRules"
        label-width="100px"
      >
        <el-form-item label="发票号码" prop="invoiceNo">
          <el-input
            v-model="invoiceForm.invoiceNo"
            placeholder="请输入发票号码"
          />
        </el-form-item>
        <el-form-item label="发票金额" prop="invoiceAmount">
          <el-input-number
            v-model="invoiceForm.invoiceAmount"
            :min="0"
            :precision="2"
            :step="100"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="开票日期" prop="invoiceDate">
          <el-date-picker
            v-model="invoiceForm.invoiceDate"
            type="date"
            placeholder="选择开票日期"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="发票图片" prop="invoiceImage">
          <el-upload
            class="upload-demo"
            action="#"
            :auto-upload="false"
            :on-change="handleInvoiceImageChange"
            :limit="1"
          >
            <template #trigger>
              <el-button type="primary">选择图片</el-button>
            </template>
            <template #tip>
              <div class="el-upload__tip">请上传发票图片，支持JPG、PNG格式</div>
            </template>
          </el-upload>
        </el-form-item>
        <el-form-item label="核验人" prop="verifier">
          <el-input v-model="invoiceForm.verifier" placeholder="请输入核验人" />
        </el-form-item>
        <el-form-item label="核验备注" prop="verifyRemark">
          <el-input
            v-model="invoiceForm.verifyRemark"
            type="textarea"
            placeholder="请输入核验备注"
            :rows="3"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="invoiceDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitInvoice">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Delete, Download } from '@element-plus/icons-vue'

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
  status: '',
})

// 重置搜索
const resetSearch = () => {
  searchForm.contractNo = ''
  searchForm.purchaseNo = ''
  searchForm.purchaseTimeRange = []
  searchForm.status = ''
  handleSearch()
}

// 处理搜索
const handleSearch = () => {
  currentPage.value = 1
  fetchData()
}

// 表格数据
const loading = ref(false)
const tableData = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const selectedRows = ref([])

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
        status: 'pending',
        invoiceVerified: false,
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
        status: 'rejected',
        invoiceVerified: false,
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
    if (searchForm.status) {
      filteredData = filteredData.filter(
        (item) => item.status === searchForm.status
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

// 处理表格选择变化
const handleSelectionChange = (rows) => {
  selectedRows.value = rows
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

// 对话框相关
const dialogVisible = ref(false)
const dialogType = ref('add')
const formRef = ref(null)

// 表单数据
const form = reactive({
  id: null,
  contractNo: '',
  purchaseNo: '',
  purchaseTime: '',
  equipmentId: '',
  warehouseId: '',
  departmentId: '',
  quantity: 1,
  amount: 0,
  model: '',
  purchaser: '',
  specificationFile: null,
  remark: '',
})

// 表单验证规则
const rules = {
  contractNo: [{ required: true, message: '请输入合同编号', trigger: 'blur' }],
  purchaseNo: [{ required: true, message: '请输入采购编号', trigger: 'blur' }],
  purchaseTime: [
    { required: true, message: '请选择采购时间', trigger: 'change' },
  ],
  equipmentId: [
    { required: true, message: '请选择采购设备', trigger: 'change' },
  ],
  warehouseId: [{ required: true, message: '请选择仓库', trigger: 'change' }],
  departmentId: [{ required: true, message: '请选择科室', trigger: 'change' }],
  quantity: [{ required: true, message: '请输入采购数量', trigger: 'blur' }],
  amount: [{ required: true, message: '请输入采购金额', trigger: 'blur' }],
  model: [{ required: true, message: '请输入设备型号', trigger: 'blur' }],
  purchaser: [{ required: true, message: '请输入采购人', trigger: 'blur' }],
}

// 设备选项
const equipmentOptions = ref([
  { value: 1, label: 'CT扫描仪' },
  { value: 2, label: '呼吸机' },
  { value: 3, label: '心电图机' },
  { value: 4, label: '超声波仪' },
  { value: 5, label: 'MRI设备' },
  { value: 6, label: '手术器械' },
])

// 仓库选项
const warehouseOptions = ref([
  { value: 1, label: '医疗设备仓库' },
  { value: 2, label: '耗材仓库' },
  { value: 3, label: '备用仓库' },
])

// 科室选项
const departmentOptions = ref([
  { value: 1, label: '放射科' },
  { value: 2, label: '重症医学科' },
  { value: 3, label: '心内科' },
  { value: 4, label: '妇产科' },
  { value: 5, label: '外科' },
  { value: 6, label: '儿科' },
])
</script>
