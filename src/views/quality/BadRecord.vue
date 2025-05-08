<template>
  <div class="container">
    <el-card class="form-card">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="设备名称" prop="deviceName">
          <el-input v-model="form.deviceName" placeholder="请输入设备名称" />
        </el-form-item>

        <el-form-item label="所在科室" prop="department">
          <el-select
            v-model="form.department"
            placeholder="请选择科室"
            filterable
            clearable
          >
            <el-option
              v-for="dept in departments"
              :key="dept.value"
              :label="dept.label"
              :value="dept.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="记录人" prop="recorder">
          <el-input v-model="form.recorder" placeholder="请输入记录人姓名" />
        </el-form-item>

        <el-form-item label="记录时间" prop="recordTime">
          <el-date-picker
            v-model="form.recordTime"
            type="datetime"
            placeholder="选择日期时间"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>

        <el-form-item label="问题描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="4"
            placeholder="请详细描述问题情况"
          />
        </el-form-item>

        <el-form-item label="附件" prop="attachments">
          <el-upload
            v-model:file-list="form.attachments"
            action="#"
            multiple
            :on-success="handleUploadSuccess"
            :on-error="handleUploadError"
            :limit="5"
            :on-exceed="handleExceed"
          >
            <el-button type="primary">
              <el-icon class="el-icon--right"><DocumentAdd /></el-icon>
              点击上传
            </el-button>
            <template #tip>
              <div class="el-upload__tip">
                支持扩展名：.pdf/.doc/.docx/.xls/.xlsx，单个文件不超过10MB
              </div>
            </template>
          </el-upload>
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
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const formRef = ref(null)
const form = reactive({
  deviceName: '',
  department: '',
  recorder: '',
  recordTime: new Date(),
  description: '',
  attachments: [],
})

const departments = ref([
  { value: 'cardiology', label: '心血管科' },
  { value: 'orthopedics', label: '骨科' },
  { value: 'pediatrics', label: '儿科' },
])

const rules = reactive({
  deviceName: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
  department: [{ required: true, message: '请选择科室', trigger: 'change' }],
  recorder: [{ required: true, message: '请输入记录人', trigger: 'blur' }],
  recordTime: [
    { required: true, message: '请选择记录时间', trigger: 'change' },
  ],
  description: [
    { required: true, message: '请输入问题描述', trigger: 'blur' },
    { min: 10, message: '描述不能少于10个字符', trigger: 'blur' },
  ],
})

const submitForm = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      ElMessage.success('提交成功')
      // 这里添加实际提交逻辑
    } else {
      ElMessage.error('请完善表单信息')
      return false
    }
  })
}

const resetForm = () => {
  formRef.value.resetFields()
}

const handleUploadSuccess = () => {
  ElMessage.success('文件上传成功')
}

const handleUploadError = () => {
  ElMessage.error('文件上传失败，请重试')
}

const handleExceed = () => {
  ElMessage.warning('文件数量超出限制，最多上传5个文件')
}
</script>

<style scoped>
.container {
  padding: 20px;
  background-color: #f5f7fa;
}

.form-card {
  max-width: 800px;
  margin: 0 auto;
}

.el-select {
  width: 100%;
}

.el-date-editor {
  width: 100%;
}
</style>
