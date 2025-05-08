<template>
  <div class="role-management-container">
    <el-card class="form-card">
      <template #header>
        <div class="card-header">
          <span>角色管理</span>
        </div>
      </template>

      <el-form ref="formRef" :model="form" label-width="120px" :rules="rules">
        <el-form-item label="角色编码" prop="code">
          <el-input v-model="form.code" placeholder="自动生成" disabled />
        </el-form-item>

        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入角色名称" />
        </el-form-item>

        <el-form-item label="角色状态" prop="status">
          <el-switch
            v-model="form.status"
            active-text="启用"
            inactive-text="停用"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>

        <el-form-item label="权限分配" prop="permissions">
          <el-tree
            ref="treeRef"
            :data="permissions"
            show-checkbox
            node-key="id"
            :props="defaultProps"
            :default-expand-all="true"
            :check-strictly="true"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm">提交</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const formRef = ref(null)
const treeRef = ref(null)

const form = ref({
  code: generateRoleCode(),
  name: '',
  status: 1,
  permissions: [],
})

const rules = {
  name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
}

// 模拟权限数据（需对接菜单管理模块）
const permissions = ref([
  {
    id: 1,
    label: '系统管理',
    children: [
      { id: 11, label: '用户管理' },
      { id: 12, label: '角色管理' },
      { id: 13, label: '菜单管理' },
      { id: 14, label: '部门管理' },
    ],
  },
  {
    id: 2,
    label: '设备管理',
    children: [
      { id: 21, label: '设备入库' },
      { id: 22, label: '设备出库' },
    ],
  },
])

const defaultProps = {
  children: 'children',
  label: 'label',
}

// 生成角色编码
function generateRoleCode() {
  const timestamp = new Date().getTime()
  return `ROLE-${timestamp}`
}

const submitForm = async () => {
  try {
    await formRef.value.validate()
    const selectedKeys = treeRef.value.getCheckedKeys()
    console.log('提交数据：', { ...form.value, permissions: selectedKeys })
    ElMessage.success('提交成功')
  } catch (error) {
    ElMessage.error('请完善表单信息')
  }
}

const resetForm = () => {
  formRef.value.resetFields()
  treeRef.value.setCheckedKeys([])
}

onMounted(() => {
  // 这里可以添加初始化数据获取逻辑
})
</script>

<style scoped>
.role-management-container {
  padding: 20px;
}

.form-card {
  max-width: 800px;
  margin: 0 auto;
}

:deep(.el-tree) {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 10px;
}
</style>
