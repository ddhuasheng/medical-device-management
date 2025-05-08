<template>
  <div class="inbound-management">
    <div class="operation-bar">
      <el-button type="primary" @click="handleAdd">新建入库</el-button>
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item>
          <el-input
            v-model="searchForm.keyword"
            placeholder="合同编号/设备名称"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="searchForm.status"
            placeholder="选择状态"
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
    </div>

    <!-- 入库列表 -->
    <el-table :data="inboundList" style="width: 100%" v-loading="loading">
      <el-table-column prop="contractNumber" label="采购合同" width="180" />
      <el-table-column prop="deviceName" label="设备名称" width="150" />
      <el-table-column prop="quantity" label="数量" width="100" />
      <el-table-column prop="warehouseName" label="仓库名称" width="150" />
      <el-table-column prop="location" label="设备位置" width="120" />
      <el-table-column prop="responsiblePerson" label="责任人" width="120" />
      <el-table-column prop="inboundTime" label="入库时间" width="150">
        <template #default="{ row }">
          {{ formatDate(row.inboundTime) }}
        </template>
      </el-table-column>
      <el-table-column label="状态" width="120">
        <template #default="{ row }">
          <el-tag :type="statusType[row.status]">
            {{ statusLabels[row.status] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <el-button
            v-if="row.status === 'pending'"
            type="primary"
            link
            @click="handleEdit(row)"
          >
            编辑
          </el-button>
          <el-button
            type="danger"
            link
            @click="handleCancel(row)"
            v-if="row.status === 'pending'"
          >
            作废
          </el-button>
          <el-button
            type="success"
            link
            @click="handleApprove(row)"
            v-if="row.status === 'pending'"
          >
            审核通过
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

    <!-- 新增/编辑对话框 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="600px"
      @close="resetForm"
    >
      <el-form
        ref="formRef"
        :model="inboundForm"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="采购合同" prop="contractNumber">
          <el-select
            v-model="inboundForm.contractNumber"
            placeholder="请选择采购合同"
            filterable
            style="width: 100%"
          >
            <el-option
              v-for="contract in contractOptions"
              :key="contract.number"
              :label="contract.number"
              :value="contract.number"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="设备名称" prop="deviceName">
          <el-input
            v-model="inboundForm.deviceName"
            placeholder="请输入设备名称"
          />
        </el-form-item>
        <el-form-item label="数量" prop="quantity">
          <el-input-number
            v-model="inboundForm.quantity"
            :min="1"
            :precision="0"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="仓库" prop="warehouseId">
          <el-select
            v-model="inboundForm.warehouseId"
            placeholder="请选择仓库"
            style="width: 100%"
          >
            <el-option
              v-for="warehouse in warehouseOptions"
              :key="warehouse.id"
              :label="warehouse.name"
              :value="warehouse.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="设备位置" prop="location">
          <el-input v-model="inboundForm.location" placeholder="格式：B-1-2" />
        </el-form-item>
        <el-form-item label="责任人" prop="responsiblePerson">
          <el-select
            v-model="inboundForm.responsiblePerson"
            placeholder="请选择责任人"
            style="width: 100%"
          >
            <el-option
              v-for="user in userOptions"
              :key="user.id"
              :label="user.name"
              :value="user.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="入库时间" prop="inboundTime">
          <el-date-picker
            v-model="inboundForm.inboundTime"
            type="datetime"
            placeholder="选择日期时间"
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import dayjs from 'dayjs'

// 状态选项
const statusOptions = [
  { value: 'completed', label: '已出库' },
  { value: 'pending', label: '待审核' },
  { value: 'canceled', label: '已作废' },
  { value: 'rejected', label: '驳回' },
]

const statusLabels = {
  completed: '已出库',
  pending: '待审核',
  canceled: '已作废',
  rejected: '驳回',
}

const statusType = {
  completed: 'success',
  pending: 'warning',
  canceled: 'info',
  rejected: 'danger',
}

// 仓库选项（与库存管理一致）
const warehouseOptions = [
  { id: 1, name: '主仓库' },
  { id: 2, name: '备用仓库' },
]

// 采购合同选项（模拟数据）
const contractOptions = ref([
  { number: 'PC-2023001', device: '血压计' },
  { number: 'PC-2023002', device: '血糖仪' },
])

// 用户选项（模拟数据）
const userOptions = ref([
  { id: 1, name: '张三' },
  { id: 2, name: '李四' },
])

// 搜索表单
const searchForm = reactive({
  keyword: '',
  status: '',
})

// 入库列表数据
const inboundList = ref([
  {
    id: 1,
    contractNumber: 'PC-2023001',
    deviceName: '血压计',
    quantity: 50,
    warehouseId: 1,
    warehouseName: '主仓库',
    location: 'A-1-1',
    responsiblePerson: 1,
    inboundTime: '2023-08-01 14:30:00',
    status: 'completed',
  },
])

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(1)

// 加载状态
const loading = ref(false)

// 表单相关
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref()
const inboundForm = reactive({
  id: null,
  contractNumber: '',
  deviceName: '',
  quantity: 1,
  warehouseId: null,
  location: '',
  responsiblePerson: null,
  inboundTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  status: 'pending',
})

// 表单校验规则
const rules = {
  contractNumber: [
    { required: true, message: '请选择采购合同', trigger: 'change' },
  ],
  deviceName: [
    { required: true, message: '请输入设备名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在2-50个字符', trigger: 'blur' },
  ],
  quantity: [
    { required: true, message: '请输入数量', trigger: 'blur' },
    { type: 'number', min: 1, message: '至少1个', trigger: 'blur' },
  ],
  warehouseId: [{ required: true, message: '请选择仓库', trigger: 'change' }],
  location: [
    { required: true, message: '请输入设备位置', trigger: 'blur' },
    {
      pattern: /^[A-Z]-\d+-\d+$/,
      message: '位置格式不正确（如：B-1-2）',
      trigger: 'blur',
    },
  ],
  responsiblePerson: [
    { required: true, message: '请选择责任人', trigger: 'change' },
  ],
  inboundTime: [
    { required: true, message: '请选择入库时间', trigger: 'change' },
  ],
}

// 日期格式化
const formatDate = (date) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}

// 搜索
const handleSearch = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 500)
}

// 重置搜索
const resetSearch = () => {
  searchForm.keyword = ''
  searchForm.status = ''
  handleSearch()
}

// 新增
const handleAdd = () => {
  dialogTitle.value = '新建入库'
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row) => {
  dialogTitle.value = '编辑入库'
  Object.assign(inboundForm, row)
  dialogVisible.value = true
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate((valid) => {
    if (valid) {
      const warehouse = warehouseOptions.find(
        (item) => item.id === inboundForm.warehouseId
      )
      const newRecord = {
        ...inboundForm,
        warehouseName: warehouse?.name,
        id: inboundForm.id || inboundList.value.length + 1,
      }

      if (inboundForm.id) {
        const index = inboundList.value.findIndex(
          (item) => item.id === inboundForm.id
        )
        inboundList.value.splice(index, 1, newRecord)
      } else {
        inboundList.value.unshift(newRecord)
      }

      ElMessage.success(`${dialogTitle.value}成功`)
      dialogVisible.value = false
      resetForm()
    }
  })
}

// 审核通过
const handleApprove = (row) => {
  ElMessageBox.confirm('确认审核通过该入库单？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    row.status = 'completed'
    ElMessage.success('审核通过成功')
  })
}

// 作废
const handleCancel = (row) => {
  ElMessageBox.confirm('确认作废该入库单？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    row.status = 'canceled'
    ElMessage.success('已作废')
  })
}

// 重置表单
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  Object.assign(inboundForm, {
    id: null,
    contractNumber: '',
    deviceName: '',
    quantity: 1,
    warehouseId: null,
    location: '',
    responsiblePerson: null,
    inboundTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    status: 'pending',
  })
}

// 分页处理
const handleSizeChange = (val) => {
  pageSize.value = val
  handleSearch()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  handleSearch()
}
</script>

<style scoped>
.inbound-management {
  padding: 20px;
}

.operation-bar {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.search-form {
  display: flex;
  align-items: center;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
