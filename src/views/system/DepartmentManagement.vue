<template>
  <div class="page-container">
    <el-card class="form-card">
      <el-form
        ref="form"
        :model="formData"
        label-width="120px"
        :rules="formRules"
      >
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入部门名称" />
        </el-form-item>

        <el-form-item label="部门编码" prop="code">
          <el-input
            v-model="formData.code"
            placeholder="自动生成"
            :disabled="true"
            class="auto-code-input"
          >
            <template #append>
              <el-button @click="generateCode">重新生成</el-button>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="上级部门" prop="parentId">
          <el-cascader
            v-model="formData.parentId"
            :options="departmentOptions"
            :props="cascaderProps"
            clearable
            placeholder="请选择上级部门"
          />
        </el-form-item>

        <el-form-item label="部门主任" prop="director">
          <el-select
            v-model="formData.director"
            placeholder="请选择部门主任"
            filterable
            clearable
          >
            <el-option
              v-for="user in userList"
              :key="user.id"
              :label="user.realName"
              :value="user.id"
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
import { ElMessage } from 'element-plus'

// 表单数据
const formData = ref({
  name: '',
  code: '',
  parentId: null,
  director: '',
  status: 1,
})

// 表单验证规则
const formRules = {
  name: [{ required: true, message: '请输入部门名称', trigger: 'blur' }],
  code: [{ required: true, message: '请生成部门编码', trigger: 'blur' }],
}

// 部门级联选项
const departmentOptions = ref([])
const cascaderProps = {
  value: 'id',
  label: 'name',
  checkStrictly: true,
}

// 用户列表（需要对接用户管理接口）
const userList = ref([])

// 生成部门编码
const generateCode = () => {
  const timestamp = new Date().getTime().toString().slice(-4)
  formData.value.code = `DEPT-${timestamp}`
}

// 提交表单
const submitForm = async () => {
  try {
    // TODO: 对接提交接口
    ElMessage.success('提交成功')
    resetForm()
  } catch (error) {
    ElMessage.error('提交失败')
  }
}

// 重置表单
const resetForm = () => {
  formData.value = {
    name: '',
    code: '',
    parentId: null,
    director: '',
    status: 1,
  }
}

onMounted(() => {
  generateCode()
  // TODO: 初始化时加载部门树和用户列表
})
</script>

<style scoped>
.form-card {
  max-width: 800px;
  margin: 20px auto;
}

.auto-code-input {
  width: 300px;
}
</style>
