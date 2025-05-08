<template>
  <div class="page-container">
    <el-card class="form-card">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
        <el-form-item label="器材名称" prop="equipment">
          <el-select
            v-model="form.equipment"
            placeholder="请选择器材"
            filterable
            clearable
          >
            <el-option
              v-for="item in equipmentList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="校准时间" prop="calibrationTime">
          <el-date-picker
            v-model="form.calibrationTime"
            type="datetime"
            placeholder="选择日期时间"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>

        <el-form-item label="校准结果" prop="result">
          <el-select v-model="form.result" placeholder="请选择结果">
            <el-option label="合格" value="pass" />
            <el-option label="不合格" value="fail" />
          </el-select>
        </el-form-item>

        <el-form-item label="校准证明" prop="certificate">
          <el-upload
            class="upload-demo"
            action="#"
            :on-change="handleFileChange"
            :auto-upload="false"
            :show-file-list="false"
          >
            <el-button type="primary">点击上传</el-button>
            <span v-if="form.certificate" class="ml-2">
              {{ form.certificate.name }}
            </span>
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
  equipment: '',
  calibrationTime: '',
  result: '',
  certificate: null,
})

// 模拟器材数据
const equipmentList = ref([
  { id: 1, name: '血压计' },
  { id: 2, name: '心电图机' },
  { id: 3, name: '生化分析仪' },
])

const rules = reactive({
  equipment: [{ required: true, message: '请选择器材', trigger: 'change' }],
  calibrationTime: [
    { required: true, message: '请选择校准时间', trigger: 'change' },
  ],
  result: [{ required: true, message: '请选择结果', trigger: 'change' }],
  certificate: [
    { required: true, message: '请上传证明文件', trigger: 'change' },
  ],
})

const handleFileChange = (file) => {
  form.certificate = file.raw
}

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
  form.certificate = null
}
</script>

<style scoped>
.form-card {
  margin: 20px;
  max-width: 800px;
}

.el-select {
  width: 100%;
}
</style>
