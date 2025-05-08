<template>
  <div class="app-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span class="header-title">设备测试记录</span>
        </div>
      </template>

      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="监测设备" prop="device">
          <el-select
            v-model="form.device"
            placeholder="请选择设备"
            filterable
            clearable
          >
            <el-option
              v-for="item in deviceOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="监测时间" prop="testTime">
          <el-date-picker
            v-model="form.testTime"
            type="datetime"
            placeholder="选择日期时间"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>

        <el-form-item label="监测人" prop="tester">
          <el-input
            v-model="form.tester"
            placeholder="请输入监测人员姓名"
            clearable
          />
        </el-form-item>

        <el-form-item label="监测结果" prop="result">
          <el-input
            v-model="form.result"
            type="textarea"
            :rows="4"
            placeholder="请输入详细测试结果"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm">提交记录</el-button>
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
  device: '',
  testTime: '',
  tester: '',
  result: '',
})

const rules = reactive({
  device: [{ required: true, message: '请选择监测设备', trigger: 'blur' }],
  testTime: [{ required: true, message: '请选择监测时间', trigger: 'blur' }],
  tester: [
    { required: true, message: '请输入监测人员', trigger: 'blur' },
    { min: 2, max: 10, message: '姓名长度2-10个字符', trigger: 'blur' },
  ],
  result: [
    { required: true, message: '请输入监测结果', trigger: 'blur' },
    {
      min: 10,
      max: 500,
      message: '结果需详细描述（10-500字）',
      trigger: 'blur',
    },
  ],
})

const deviceOptions = ref([
  { value: 'device1', label: '心电图机' },
  { value: 'device2', label: '呼吸机' },
  { value: 'device3', label: '血液透析机' },
])

const submitForm = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      ElMessage.success('测试记录提交成功！')
      // 这里实际应调用API接口提交数据
      console.log('提交数据：', JSON.stringify(form))
    } else {
      ElMessage.error('请完善表单信息')
      return false
    }
  })
}

const resetForm = () => {
  formRef.value.resetFields()
}
</script>

<style scoped>
.app-container {
  padding: 20px;
}

.box-card {
  max-width: 800px;
  margin: 0 auto;
}

.header-title {
  font-size: 18px;
  font-weight: 600;
}

.el-form {
  padding: 20px 40px;
}

.el-select {
  width: 100%;
}
</style>
