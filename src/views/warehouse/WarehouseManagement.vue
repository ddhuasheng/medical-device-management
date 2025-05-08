<template>
  <div class="warehouse-management">
    <div class="operation-bar">
      <el-button type="primary" @click="handleAdd">新增仓库</el-button>
    </div>

    <!-- 仓库列表 -->
    <el-table :data="warehouseList" style="width: 100%" v-loading="loading">
      <el-table-column prop="code" label="仓库编码" width="120" />
      <el-table-column prop="name" label="仓库名称" width="180" />
      <el-table-column prop="address" label="仓库地址" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status ? 'success' : 'danger'">
            {{ row.status ? '启用' : '停用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link @click="handleEdit(row)"
            >编辑</el-button
          >
          <el-button
            :type="row.status ? 'danger' : 'success'"
            link
            @click="handleStatusChange(row)"
          >
            {{ row.status ? '停用' : '启用' }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增/编辑仓库对话框 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="500px"
      @close="resetForm"
    >
      <el-form
        ref="formRef"
        :model="warehouseForm"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="仓库编码" prop="code">
          <el-input v-model="warehouseForm.code" placeholder="请输入仓库编码" />
        </el-form-item>
        <el-form-item label="仓库名称" prop="name">
          <el-input v-model="warehouseForm.name" placeholder="请输入仓库名称" />
        </el-form-item>
        <el-form-item label="仓库地址" prop="address">
          <el-input
            v-model="warehouseForm.address"
            type="textarea"
            placeholder="请输入仓库地址"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="warehouseForm.status"
            :active-value="true"
            :inactive-value="false"
            active-text="启用"
            inactive-text="停用"
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

// 仓库列表数据
const warehouseList = ref([
  {
    id: 1,
    code: 'WH001',
    name: '主仓库',
    address: '北京市朝阳区xx街道xx号',
    status: true,
  },
  {
    id: 2,
    code: 'WH002',
    name: '备用仓库',
    address: '北京市海淀区xx街道xx号',
    status: true,
  },
])

// 加载状态
const loading = ref(false)

// 表单相关
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref()
const warehouseForm = reactive({
  id: null,
  code: '',
  name: '',
  address: '',
  status: true,
})

// 表单校验规则
const rules = {
  code: [
    { required: true, message: '请输入仓库编码', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' },
  ],
  name: [
    { required: true, message: '请输入仓库名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' },
  ],
  address: [
    { required: true, message: '请输入仓库地址', trigger: 'blur' },
    { min: 5, max: 200, message: '长度在 5 到 200 个字符', trigger: 'blur' },
  ],
}

// 新增仓库
const handleAdd = () => {
  dialogTitle.value = '新增仓库'
  dialogVisible.value = true
}

// 编辑仓库
const handleEdit = (row) => {
  dialogTitle.value = '编辑仓库'
  Object.assign(warehouseForm, row)
  dialogVisible.value = true
}

// 修改仓库状态
const handleStatusChange = (row) => {
  const statusText = row.status ? '停用' : '启用'
  ElMessageBox.confirm(`确认要${statusText}该仓库吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      // 在实际应用中，这里应该调用后端API
      row.status = !row.status
      ElMessage.success(`${statusText}成功`)
    })
    .catch(() => {})
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate((valid) => {
    if (valid) {
      // 在实际应用中，这里应该调用后端API
      if (warehouseForm.id) {
        // 编辑
        const index = warehouseList.value.findIndex(
          (item) => item.id === warehouseForm.id
        )
        if (index !== -1) {
          warehouseList.value[index] = { ...warehouseForm }
        }
        ElMessage.success('编辑成功')
      } else {
        // 新增
        const newWarehouse = {
          ...warehouseForm,
          id: warehouseList.value.length + 1,
        }
        warehouseList.value.push(newWarehouse)
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
  Object.assign(warehouseForm, {
    id: null,
    code: '',
    name: '',
    address: '',
    status: true,
  })
}
</script>

<style scoped>
.warehouse-management {
  padding: 20px;
}

.operation-bar {
  margin-bottom: 20px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
