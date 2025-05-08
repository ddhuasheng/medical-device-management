<template>
  <div class="container">
    <el-card shadow="never">
      <div class="header">
        <el-button type="primary" @click="handleAdd">新增菜单</el-button>
      </div>

      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="name" label="菜单名称" width="180" />
        <el-table-column prop="type" label="菜单类型" width="120">
          <template #default="{ row }">
            <el-tag :type="typeTagMap[row.type]">
              {{ typeOptions.find((t) => t.value === row.type)?.label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="permission" label="按钮标识符" />
        <el-table-column prop="parent" label="父菜单" />
        <el-table-column prop="path" label="路由路径" />
        <el-table-column prop="icon" label="菜单图标" width="100">
          <template #default="{ row }">
            <el-icon v-if="row.icon">
              <component :is="row.icon" />
            </el-icon>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-switch
              v-model="row.status"
              active-value="1"
              inactive-value="0"
              active-text="启用"
              inactive-text="停用"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="{ row }">
            <el-button type="text" @click="handleEdit(row)">编辑</el-button>
            <el-button type="text" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 表单对话框 -->
      <el-dialog v-model="dialogVisible" :title="dialogTitle">
        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-width="100px"
          style="padding-right: 30px"
        >
          <el-form-item label="菜单类型" prop="type">
            <el-select
              v-model="form.type"
              placeholder="请选择"
              @change="handleTypeChange"
            >
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item
            v-if="form.type === 'button'"
            label="按钮标识符"
            prop="permission"
          >
            <el-input v-model="form.permission" placeholder="请输入权限标识" />
          </el-form-item>

          <el-form-item
            v-if="form.type !== 'button'"
            label="菜单名称"
            prop="name"
          >
            <el-input v-model="form.name" />
          </el-form-item>

          <el-form-item label="父菜单" prop="parentId">
            <el-cascader
              v-model="form.parentId"
              :options="parentOptions"
              :props="cascaderProps"
              clearable
            />
          </el-form-item>

          <el-form-item
            v-if="form.type !== 'button'"
            label="路由路径"
            prop="path"
          >
            <el-input v-model="form.path">
              <template #prepend>/</template>
            </el-input>
          </el-form-item>

          <el-form-item
            v-if="form.type !== 'button'"
            label="菜单图标"
            prop="icon"
          >
            <el-icon-select v-model="form.icon" />
          </el-form-item>

          <el-form-item label="状态" prop="status">
            <el-switch
              v-model="form.status"
              active-value="1"
              inactive-value="0"
              active-text="启用"
              inactive-text="停用"
            />
          </el-form-item>
        </el-form>

        <template #footer>
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm">确认</el-button>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

// 模拟数据
const tableData = ref([
  {
    id: 1,
    name: '系统管理',
    type: 'directory',
    path: '/system',
    icon: 'Setting',
    status: '1',
  },
])

// 表单相关状态
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref(null)
const form = reactive({
  id: null,
  type: 'directory',
  name: '',
  permission: '',
  parentId: null,
  path: '',
  icon: '',
  status: '1',
})

// 类型选项
const typeOptions = [
  { value: 'directory', label: '目录' },
  { value: 'menu', label: '菜单' },
  { value: 'button', label: '按钮' },
]

// 类型标签映射
const typeTagMap = {
  directory: 'success',
  menu: 'primary',
  button: 'warning',
}

// 父菜单选项（需要对接后端后替换为真实数据）
const parentOptions = ref([
  {
    value: 0,
    label: '根目录',
    children: tableData.value,
  },
])

// 级联选择器配置
const cascaderProps = {
  checkStrictly: true,
  label: 'name',
  value: 'id',
  emitPath: false,
}

// 表单验证规则
const rules = reactive({
  name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择菜单类型', trigger: 'change' }],
  path: [
    { required: true, message: '请输入路由路径', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z\-]+$/,
      message: '路径只能包含字母和横线',
      trigger: 'blur',
    },
  ],
  permission: [
    { required: true, message: '请输入权限标识', trigger: 'blur' },
    { pattern: /^[a-zA-Z:]+$/, message: '权限标识格式不正确', trigger: 'blur' },
  ],
})

// 处理菜单类型变化
const handleTypeChange = (val) => {
  if (val === 'button') {
    form.path = ''
    form.icon = ''
  }
}

// 新增菜单
const handleAdd = () => {
  dialogTitle.value = '新增菜单'
  Object.keys(form).forEach((key) => {
    form[key] = key === 'status' ? '1' : key === 'type' ? 'directory' : ''
  })
  dialogVisible.value = true
}

// 提交表单
const submitForm = async () => {
  await formRef.value.validate()
  // TODO: 提交到后端
  ElMessage.success('操作成功')
  dialogVisible.value = false
}

// 编辑菜单
const handleEdit = (row) => {
  dialogTitle.value = '编辑菜单'
  Object.assign(form, row)
  dialogVisible.value = true
}

// 删除菜单
const handleDelete = (row) => {
  ElMessageBox.confirm('确认删除该菜单？', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    // TODO: 调用删除接口
    ElMessage.success('删除成功')
  })
}
</script>

<style scoped>
.container {
  padding: 20px;
}
.header {
  margin-bottom: 20px;
}
</style>
