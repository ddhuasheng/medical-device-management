<template>
  <div class="app-container">
    <el-form
      ref="form"
      :model="formData"
      label-width="120px"
      label-position="left"
    >
      <el-form-item label="巡检时间" prop="inspectionTime">
        <el-date-picker
          v-model="formData.inspectionTime"
          type="datetime"
          placeholder="选择日期时间"
          value-format="YYYY-MM-DD HH:mm:ss"
          style="width: 300px"
        />
      </el-form-item>

      <el-form-item label="巡检设备" prop="equipmentId">
        <el-select
          v-model="formData.equipmentId"
          filterable
          remote
          :remote-method="searchEquipment"
          placeholder="请输入设备编号搜索"
          @change="handleEquipmentChange"
        >
          <el-option
            v-for="item in equipmentOptions"
            :key="item.id"
            :label="item.number"
            :value="item.id"
          >
            <span>{{ item.number }}</span>
            <span style="color: #8492a6; margin-left: 10px">{{
              item.name
            }}</span>
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="是否异常" prop="isAbnormal">
        <el-switch
          v-model="formData.isAbnormal"
          active-text="是"
          inactive-text="否"
          @change="handleAbnormalChange"
        />
      </el-form-item>

      <el-form-item
        v-if="formData.isAbnormal"
        label="异常信息"
        prop="abnormalInfo"
      >
        <el-input
          v-model="formData.abnormalInfo"
          type="textarea"
          :rows="3"
          placeholder="请输入异常详细信息"
          style="width: 300px"
        />
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
        inspectionTime: '',
        equipmentId: '',
        isAbnormal: false,
        abnormalInfo: '',
      },
      equipmentOptions: [],
    }
  },
  methods: {
    searchEquipment(query) {
      this.equipmentOptions = query
        ? [{ id: '001', number: 'EQ2023001', name: 'CT扫描仪' }]
        : []
    },
    handleEquipmentChange(val) {
      const selected = this.equipmentOptions.find((item) => item.id === val)
      this.formData.equipmentName = selected?.name || ''
    },
    handleAbnormalChange(val) {
      if (!val) this.formData.abnormalInfo = ''
    },
    submitForm() {
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
