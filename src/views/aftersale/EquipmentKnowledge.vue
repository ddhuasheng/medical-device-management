<template>
  <div class="app-container">
    <el-form ref="form" :model="formData" label-width="150px">
      <!-- 设备选择 -->
      <el-form-item
        label="设备名称"
        prop="deviceId"
        :rules="[{ required: true, message: '请选择设备' }]"
      >
        <el-select
          v-model="formData.deviceId"
          filterable
          remote
          placeholder="请输入设备名称"
          :remote-method="getDevices"
          :loading="loading"
        >
          <el-option
            v-for="item in devices"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <!-- 设备图片上传 -->
      <el-form-item label="设备图片">
        <el-upload
          v-model:file-list="formData.images"
          action="#"
          list-type="picture-card"
          :multiple="true"
          :limit="5"
          :on-change="handleImageUpload"
          accept="image/*"
        >
          <el-icon><Plus /></el-icon>
        </el-upload>
      </el-form-item>

      <!-- 使用手册管理 -->
      <el-form-item label="使用手册">
        <el-upload
          v-model:file-list="formData.userManual"
          action="#"
          :limit="1"
          accept=".pdf"
          :on-change="handleManualUpload('userManual')"
        >
          <el-button type="primary">上传PDF文件</el-button>
          <template #tip>
            <div class="el-upload__tip">请上传PDF格式的使用说明书</div>
          </template>
        </el-upload>
        <vue-pdf-embed
          v-if="formData.userManual.length > 0"
          :source="formData.userManual[0].url"
          class="pdf-viewer"
        />
      </el-form-item>

      <!-- 故障排查手册 -->
      <el-form-item label="故障排查手册">
        <el-upload
          v-model:file-list="formData.troubleshootingManual"
          action="#"
          :limit="1"
          accept=".pdf"
          :on-change="handleManualUpload('troubleshootingManual')"
        >
          <el-button type="primary">上传PDF文件</el-button>
          <template #tip>
            <div class="el-upload__tip">请上传PDF格式的故障排查手册</div>
          </template>
        </el-upload>
        <vue-pdf-embed
          v-if="formData.troubleshootingManual.length > 0"
          :source="formData.troubleshootingManual[0].url"
          class="pdf-viewer"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import VuePdfEmbed from 'vue3-pdf-embed'

const formData = ref({
  deviceId: '',
  images: [],
  userManual: [],
  troubleshootingManual: [],
})

const devices = ref([])
const loading = ref(false)

// 获取设备列表
const getDevices = async (query) => {
  // 实际应调用接口获取设备数据
  devices.value = [
    { id: 1, name: 'CT扫描仪' },
    { id: 2, name: 'MRI设备' },
  ].filter((item) => item.name.includes(query))
}

// 处理图片上传
const handleImageUpload = (file) => {
  // 生成预览URL
  file.url = URL.createObjectURL(file.raw)
}

// 处理手册上传
const handleManualUpload = (type) => (file) => {
  formData.value[type] = [
    {
      name: file.name,
      url: URL.createObjectURL(file.raw),
      raw: file.raw,
    },
  ]
}
</script>

<style scoped>
.pdf-viewer {
  margin-top: 20px;
  border: 1px solid #eee;
  min-height: 500px;
}
</style>
