<template>
  <div class="app-container">
    <el-form ref="form" :model="formData" label-width="120px">
      <el-form-item label="保修编号">
        <el-input v-model="formData.repairNo" placeholder="自动生成" disabled />
      </el-form-item>

      <el-form-item label="设备编号">
        <el-select
          v-model="formData.equipmentId"
          filterable
          remote
          reserve-keyword
          placeholder="请输入设备编号"
          :remote-method="searchEquipment"
          @change="handleEquipmentChange"
        >
          <el-option
            v-for="item in equipmentOptions"
            :key="item.id"
            :label="item.number"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="设备名称">
        <el-input v-model="formData.equipmentName" disabled />
      </el-form-item>

      <el-form-item label="报修人">
        <el-input v-model="formData.reporter" />
      </el-form-item>

      <el-form-item label="报修科室">
        <el-input v-model="formData.department" />
      </el-form-item>

      <el-form-item label="保修时间">
        <el-date-picker
          v-model="formData.reportTime"
          type="datetime"
          placeholder="选择报修时间"
        />
      </el-form-item>

      <el-form-item label="报修原因">
        <el-input
          v-model="formData.reason"
          type="textarea"
          :rows="3"
          placeholder="请输入详细报修原因"
        />
      </el-form-item>

      <el-form-item label="维修人员">
        <el-select v-model="formData.maintainer" placeholder="请选择维修人员">
          <el-option
            v-for="item in maintainerOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="维修时间">
        <el-date-picker
          v-model="formData.maintainTime"
          type="datetime"
          placeholder="选择维修时间"
        />
      </el-form-item>

      <el-form-item label="状态">
        <el-select v-model="formData.status" placeholder="请选择状态">
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
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
        repairNo: '',
        equipmentId: '',
        equipmentName: '',
        reporter: '',
        department: '',
        reportTime: '',
        reason: '',
        maintainer: '',
        maintainTime: '',
        status: '',
      },
      equipmentOptions: [],
      maintainerOptions: [
        { label: '维修员张三', value: '1' },
        { label: '维修员李四', value: '2' },
      ],
      statusOptions: [
        { label: '待处理', value: '0' },
        { label: '进行中', value: '1' },
        { label: '已完成', value: '2' },
      ],
    }
  },
  methods: {
    searchEquipment(query) {
      // 模拟设备搜索接口
      this.equipmentOptions = query
        ? [{ id: '001', number: 'EQ2023001', name: 'CT扫描仪' }]
        : []
    },
    handleEquipmentChange(val) {
      const selected = this.equipmentOptions.find((item) => item.id === val)
      this.formData.equipmentName = selected?.name || ''
    },
    submitForm() {
      console.log('提交数据：', this.formData)
      this.$message.success('提交成功')
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
