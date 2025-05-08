<template>
  <div class="user-management-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>用户管理</span>
          <el-button type="primary" @click="handleAdd">新增用户</el-button>
        </div>
      </template>

      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="userNo" label="用户编号" width="120" />
        <el-table-column prop="username" label="用户名" width="150" />
        <el-table-column prop="department" label="所属部门" width="180">
          <template #default="scope">
            <el-tag>{{ scope.row.department }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="roles" label="角色" width="200">
          <template #default="scope">
            <el-tag
              v-for="(role, index) in scope.row.roles"
              :key="index"
              type="info"
              class="role-tag"
            >
              {{ role }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              active-text="启用"
              inactive-text="停用"
              :active-value="1"
              :inactive-value="0"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button
              size="small"
              type="danger"
              @click="handleDelete(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle">
      <el-form
        :model="formData"
        :rules="formRules"
        ref="formRef"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formData.username" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="formData.password" show-password />
        </el-form-item>
        <el-form-item label="所属部门" prop="department">
          <el-select
            v-model="formData.department"
            placeholder="请选择部门"
            filterable
          >
            <el-option
              v-for="dept in departmentOptions"
              :key="dept.value"
              :label="dept.label"
              :value="dept.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="角色" prop="roles">
          <el-select v-model="formData.roles" multiple placeholder="请选择角色">
            <el-option
              v-for="role in roleOptions"
              :key="role.value"
              :label="role.label"
              :value="role.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="formData.status"
            active-text="启用"
            inactive-text="停用"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 表单引用
const formRef = ref(null)

// 表格数据
const tableData = ref([
  {
    userNo: 'U1001',
    username: 'admin',
    department: '信息科',
    roles: ['系统管理员'],
    status: 1,
  },
])

// 对话框控制
const dialogVisible = ref(false)
const dialogTitle = ref('新增用户')
const isEditMode = ref(false)

// 表单数据
const formData = reactive({
  username: '',
  password: '',
  department: '',
  roles: [],
  status: 1,
})

// 部门选项（示例数据）
const departmentOptions = reactive([
  { value: '信息科', label: '信息科' },
  { value: '财务科', label: '财务科' },
  { value: '设备科', label: '设备科' },
])

// 角色选项（示例数据）
const roleOptions = reactive([
  { value: '系统管理员', label: '系统管理员' },
  { value: '普通用户', label: '普通用户' },
  { value: '设备管理员', label: '设备管理员' },
])

// 表单验证规则
const formRules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 16, message: '长度在 3 到 16 个字符', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' },
  ],
  department: [
    { required: true, message: '请选择所属部门', trigger: 'change' },
  ],
  roles: [{ required: true, message: '请选择角色', trigger: 'change' }],
})

// 打开新增对话框
const handleAdd = () => {
  isEditMode.value = false
  dialogTitle.value = '新增用户'
  resetForm()
  dialogVisible.value = true
}

// 打开编辑对话框
const handleEdit = (row) => {
  isEditMode.value = true
  dialogTitle.value = '编辑用户'
  Object.assign(formData, row)
  dialogVisible.value = true
}

// 提交表单
const submitForm = async () => {
  try {
    await formRef.value.validate()

    if (isEditMode.value) {
      // 更新逻辑
      const index = tableData.value.findIndex(
        (item) => item.userNo === formData.userNo
      )
      if (index !== -1) {
        tableData.value.splice(index, 1, { ...formData })
      }
    } else {
      // 新增逻辑
      tableData.value.push({
        ...formData,
        userNo: generateUserNo(),
      })
    }

    ElMessage.success(isEditMode.value ? '修改成功' : '新增成功')
    dialogVisible.value = false
  } catch (error) {
    console.log('表单验证失败', error)
  }
}

// 生成用户编号
const generateUserNo = () => {
  return 'U' + Math.floor(1000 + Math.random() * 9000)
}

// 重置表单
const resetForm = () => {
  formRef.value?.resetFields()
  Object.keys(formData).forEach((key) => {
    if (key !== 'status') {
      formData[key] = ''
    }
  })
  formData.status = 1
}

// 删除用户
const handleDelete = (row) => {
  ElMessageBox.confirm('确定删除该用户吗？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    const index = tableData.value.findIndex(
      (item) => item.userNo === row.userNo
    )
    if (index !== -1) {
      tableData.value.splice(index, 1)
      ElMessage.success('删除成功')
    }
  })
}
</script>

<style scoped>
.user-management-container {
  padding: 20px;
}

.box-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.role-tag {
  margin-right: 5px;
}
</style>
