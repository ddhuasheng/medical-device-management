<template>
  <div class="page-container">
    <el-card class="form-card">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="设备名称" prop="deviceName">
              <el-select
                v-model="form.deviceName"
                filterable
                placeholder="请选择设备"
                @change="handleDeviceChange"
              >
                <el-option
                  v-for="item in deviceList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="设备编号" prop="deviceId">
              <el-input v-model="form.deviceId" disabled />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="报废原因" prop="reason">
              <el-input
                v-model="form.reason"
                type="textarea"
                :rows="4"
                placeholder="请输入详细报废原因"
              />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="报废图片" prop="images">
              <el-upload
                action="/api/upload"
                list-type="picture-card"
                :limit="5"
                :file-list="form.images"
                :on-success="handleUploadSuccess"
                :on-remove="handleRemove"
              >
                <el-icon><Plus /></el-icon>
              </el-upload>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="报废时间" prop="scrapTime">
              <el-date-picker
                v-model="form.scrapTime"
                type="datetime"
                placeholder="选择日期时间"
                value-format="YYYY-MM-DD HH:mm:ss"
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="当前状态" prop="status">
              <el-select
                v-model="form.status"
                placeholder="请选择状态"
                :disabled="form.status === '确认报废'"
              >
                <el-option
                  v-for="item in statusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item class="form-footer">
          <el-button type="primary" @click="submitForm">提交申请</el-button>
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
  deviceId: '',
  reason: '',
  images: [],
  scrapTime: '',
  status: '待确认',
})

const statusOptions = [
  { value: '待确认', label: '待确认' },
  { value: '驳回', label: '驳回' },
  { value: '确认报废', label: '确认报废' },
]

const deviceList = ref([
  { id: '001', name: 'CT扫描仪' },
  { id: '002', name: 'MRI设备' },
])

const rules = reactive({
  deviceName: [{ required: true, message: '请选择设备', trigger: 'change' }],
  reason: [{ required: true, message: '请输入报废原因', trigger: 'blur' }],
  scrapTime: [{ required: true, message: '请选择报废时间', trigger: 'change' }],
})

const handleDeviceChange = (deviceId) => {
  const device = deviceList.value.find((item) => item.id === deviceId)
  form.deviceId = device ? device.id : ''
}

const handleUploadSuccess = (response, file) => {
  form.images.push({ name: file.name, url: response.url })
}

const handleRemove = (file) => {
  const index = form.images.findIndex((item) => item.uid === file.uid)
  form.images.splice(index, 1)
}

const submitForm = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      ElMessage.success('提交成功')
      // 调用API接口
    } else {
      return false
    }
  })
}

const resetForm = () => {
  formRef.value.resetFields()
}
</script>

<style scoped>
.form-card {
  margin: 20px;
}

.form-footer {
  margin-top: 30px;
  text-align: center;
}
</style>
