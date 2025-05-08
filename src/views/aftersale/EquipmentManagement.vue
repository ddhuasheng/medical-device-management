<template>
  <div class="app-container">
    <el-form ref="form" :model="formData" label-width="150px">
      <!-- 设备基本信息 -->
      <el-form-item
        label="设备名称"
        prop="name"
        :rules="[{ required: true, message: '请输入设备名称' }]"
      >
        <el-input v-model="formData.name" placeholder="请输入设备名称" />
      </el-form-item>

      <el-form-item
        label="设备型号"
        prop="model"
        :rules="[{ required: true, message: '请输入设备型号' }]"
      >
        <el-input v-model="formData.model" placeholder="请输入设备型号" />
      </el-form-item>

      <el-form-item
        label="序列号"
        prop="sn"
        :rules="[{ required: true, message: '请输入序列号' }]"
      >
        <el-input v-model="formData.sn" placeholder="请输入设备序列号" />
      </el-form-item>

      <!-- 图片上传 -->
      <el-form-item label="设备图片">
        <el-upload
          action="#"
          list-type="picture-card"
          :auto-upload="false"
          :on-change="handleImageUpload"
        >
          <el-icon><Plus /></el-icon>
        </el-upload>
      </el-form-item>

      <!-- 二维码上传 -->
      <el-form-item label="设备二维码">
        <el-upload action="#" :limit="1" :on-change="handleQrCodeUpload">
          <el-button type="primary">点击上传</el-button>
        </el-upload>
      </el-form-item>

      <el-form-item label="维保时间" prop="warrantyDate">
        <el-date-picker
          v-model="formData.warrantyDate"
          type="date"
          placeholder="选择维保到期日"
        />
      </el-form-item>

      <el-form-item label="仓库名称" prop="warehouse">
        <el-select
          v-model="formData.warehouse"
          placeholder="请选择仓库"
          @change="loadContracts"
        >
          <el-option
            v-for="item in warehouseOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="采购合同" prop="contract">
        <el-select
          v-model="formData.contract"
          placeholder="请选择合同"
          :disabled="!formData.warehouse"
        >
          <el-option
            v-for="item in contractOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="数量" prop="quantity">
        <el-input-number v-model="formData.quantity" :min="1" />
      </el-form-item>

      <el-form-item label="设备位置" prop="location" :rules="locationRules">
        <el-input
          v-model="formData.location"
          placeholder="请输入位置（格式：A01-01）"
        />
      </el-form-item>

      <el-form-item label="维保证明">
        <el-upload action="#" :limit="1" :on-change="handleWarrantyUpload">
          <el-button type="primary">上传文件</el-button>
        </el-upload>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        name: '',
        model: '',
        sn: '',
        warrantyDate: '',
        warehouse: '',
        contract: '',
        quantity: 1,
        location: '',
        warrantyFile: null,
      },
      warehouseOptions: [
        { label: '主仓库', value: '1' },
        { label: '备用仓库', value: '2' },
      ],
      contractOptions: [],
      locationRules: [
        { pattern: /^[A-Z]\d+-\d+$/, message: '格式示例：A01-01' },
      ],
    }
  },
  methods: {
    handleImageUpload(file) {
      this.formData.image = file.raw
    },
    handleQrCodeUpload(file) {
      this.formData.qrCode = file.raw
    },
    handleWarrantyUpload(file) {
      this.formData.warrantyFile = file.raw
    },
    loadContracts(warehouseId) {
      this.contractOptions = warehouseId
        ? [
            { label: 'CT2023-001', value: '1' },
            { label: 'MRI2023-002', value: '2' },
          ]
        : []
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          console.log('提交数据:', this.formData)
          this.$message.success('提交成功')
        }
      })
    },
    resetForm() {
      this.$refs.form.resetFields()
    },
  },
}
</script>

<style scoped>
.app-container {
  padding: 20px;
}
.el-input {
  width: 300px;
}
.el-select {
  width: 300px;
}
.el-date-editor {
  width: 300px;
}
</style>
