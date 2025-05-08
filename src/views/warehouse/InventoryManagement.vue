<template>
  <div class="inventory-management">
    <div class="operation-bar">
      <el-button type="primary" @click="handleAdd">新增库存</el-button>
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item>
          <el-input
            v-model="searchForm.keyword"
            placeholder="设备型号/名称"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="searchForm.warehouseId"
            placeholder="选择仓库"
            clearable
          >
            <el-option
              v-for="item in warehouseOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 库存列表 -->
    <el-table :data="inventoryList" style="width: 100%" v-loading="loading">
      <el-table-column prop="modelNumber" label="设备型号" width="150" />
      <el-table-column prop="deviceName" label="设备名称" width="180" />
      <el-table-column prop="quantity" label="设备数量" width="100">
        <template #default="{ row }">
          <span :class="{ 'warning-text': row.quantity <= row.minQuantity }">
            {{ row.quantity }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="warehouseName" label="所在仓库" width="150" />
      <el-table-column prop="location" label="设备位置" width="120" />
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link @click="handleEdit(row)"
            >编辑</el-button
          >
          <el-button type="danger" link @click="handleDelete(row)"
            >删除</el-button
          >
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

    <!-- 新增/编辑库存对话框 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="500px"
      @close="resetForm"
    >
      <el-form
        ref="formRef"
        :model="inventoryForm"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="设备型号" prop="modelNumber">
          <el-input
            v-model="inventoryForm.modelNumber"
            placeholder="请输入设备型号"
          />
        </el-form-item>
        <el-form-item label="设备名称" prop="deviceName">
          <el-input
            v-model="inventoryForm.deviceName"
            placeholder="请输入设备名称"
          />
        </el-form-item>
        <el-form-item label="设备数量" prop="quantity">
          <el-input-number
            v-model="inventoryForm.quantity"
            :min="0"
            :precision="0"
            placeholder="请输入设备数量"
          />
        </el-form-item>
        <el-form-item label="最小库存" prop="minQuantity">
          <el-input-number
            v-model="inventoryForm.minQuantity"
            :min="0"
            :precision="0"
            placeholder="请输入最小库存数量"
          />
        </el-form-item>
        <el-form-item label="所在仓库" prop="warehouseId">
          <el-select
            v-model="inventoryForm.warehouseId"
            placeholder="请选择仓库"
            style="width: 100%"
          >
            <el-option
              v-for="item in warehouseOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="设备位置" prop="location">
          <el-input
            v-model="inventoryForm.location"
            placeholder="请输入设备位置（如：B-1-2）"
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

// 仓库选项
const warehouseOptions = [
  { id: 1, name: '主仓库' },
  { id: 2, name: '备用仓库' },
]

// 搜索表单
const searchForm = reactive({
  keyword: '',
  warehouseId: null,
})

// 库存列表数据
const inventoryList = ref([
  {
    id: 1,
    modelNumber: 'MDM-001',
    deviceName: '血压计',
    quantity: 50,
    minQuantity: 10,
    warehouseId: 1,
    warehouseName: '主仓库',
    location: 'A-1-1',
  },
  {
    id: 2,
    modelNumber: 'MDM-002',
    deviceName: '血糖仪',
    quantity: 30,
    minQuantity: 5,
    warehouseId: 2,
    warehouseName: '备用仓库',
    location: 'B-1-2',
  },
])

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 加载状态
const loading = ref(false)

// 表单相关
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref()
const inventoryForm = reactive({
  id: null,
  modelNumber: '',
  deviceName: '',
  quantity: 0,
  minQuantity: 0,
  warehouseId: null,
  location: '',
})

// 表单校验规则
const rules = {
  modelNumber: [
    { required: true, message: '请输入设备型号', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' },
  ],
  deviceName: [
    { required: true, message: '请输入设备名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' },
  ],
  quantity: [
    { required: true, message: '请输入设备数量', trigger: 'blur' },
    { type: 'number', min: 0, message: '数量不能小于0', trigger: 'blur' },
  ],
  minQuantity: [
    { required: true, message: '请输入最小库存数量', trigger: 'blur' },
    { type: 'number', min: 0, message: '数量不能小于0', trigger: 'blur' },
  ],
  warehouseId: [
    { required: true, message: '请选择所在仓库', trigger: 'change' },
  ],
  location: [
    { required: true, message: '请输入设备位置', trigger: 'blur' },
    {
      pattern: /^[A-Z]-\d+-\d+$/,
      message: '位置格式不正确（如：B-1-2）',
      trigger: 'blur',
    },
  ],
}

// 搜索
const handleSearch = () => {
  // 在实际应用中，这里应该调用后端API进行搜索
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 500)
}

// 重置搜索
const resetSearch = () => {
  searchForm.keyword = ''
  searchForm.warehouseId = null
  handleSearch()
}

// 新增库存
const handleAdd = () => {
  dialogTitle.value = '新增库存'
  dialogVisible.value = true
}

// 编辑库存
const handleEdit = (row) => {
  dialogTitle.value = '编辑库存'
  Object.assign(inventoryForm, row)
  dialogVisible.value = true
}

// 删除库存
const handleDelete = (row) => {
  ElMessageBox.confirm('确认要删除该库存记录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      // 在实际应用中，这里应该调用后端API
      const index = inventoryList.value.findIndex((item) => item.id === row.id)
      if (index !== -1) {
        inventoryList.value.splice(index, 1)
      }
      ElMessage.success('删除成功')
    })
    .catch(() => {})
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate((valid) => {
    if (valid) {
      // 在实际应用中，这里应该调用后端API
      const warehouseInfo = warehouseOptions.find(
        (item) => item.id === inventoryForm.warehouseId
      )
      if (inventoryForm.id) {
        // 编辑
        const index = inventoryList.value.findIndex(
          (item) => item.id === inventoryForm.id
        )
        if (index !== -1) {
          inventoryList.value[index] = {
            ...inventoryForm,
            warehouseName: warehouseInfo?.name,
          }
        }
        ElMessage.success('编辑成功')
      } else {
        // 新增
        const newInventory = {
          ...inventoryForm,
          id: inventoryList.value.length + 1,
          warehouseName: warehouseInfo?.name,
        }
        inventoryList.value.push(newInventory)
        ElMessage.success('新增成功')
      }
      dialogVisible.value = false
      resetForm()
    }
  })
}

// 重置表单
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  Object.assign(inventoryForm, {
    id: null,
    modelNumber: '',
    deviceName: '',
    quantity: 0,
    minQuantity: 0,
    warehouseId: null,
    location: '',
  })
}

// 分页相关方法
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
.inventory-management {
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

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.warning-text {
  color: #f56c6c;
}
</style>
