<template>
  <div class="app-container">
    <el-form ref="form" :model="formData" label-width="120px" :rules="rules">
      <el-form-item label="异常名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入异常名称" />
      </el-form-item>

      <el-form-item label="所在科室" prop="department">
        <el-select
          v-model="formData.department"
          filterable
          remote
          reserve-keyword
          placeholder="请选择或搜索科室"
          :remote-method="searchDepartment"
        >
          <el-option
            v-for="item in departmentOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="发生时间" prop="occurTime">
        <el-date-picker
          v-model="formData.occurTime"
          type="datetime"
          placeholder="选择日期时间"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>

      <el-form-item label="故障类型" prop="faultType">
        <el-radio-group v-model="formData.faultType">
          <el-radio-button label="人为损坏" />
          <el-radio-button label="突发故障" />
        </el-radio-group>
      </el-form-item>

      <el-form-item label="是否处理" prop="isHandled">
        <el-switch
          v-model="formData.isHandled"
          active-text="已处理"
          inactive-text="未处理"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import dayjs from 'dayjs'

const formData = ref({
  deviceName: '',
  name: '',
  department: '',
  occurTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  faultType: '人为损坏',
  isHandled: false,
})

const departmentOptions = ref([])

const rules = {
  deviceName: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
  name: [{ required: true, message: '请输入异常名称', trigger: 'blur' }],
  department: [{ required: true, message: '请选择科室', trigger: 'change' }],
  occurTime: [{ required: true, message: '请选择发生时间', trigger: 'change' }],
}

const searchDepartment = async (query) => {
  // TODO: 对接科室管理接口
  if (query) {
    departmentOptions.value = [
      { id: 1, name: '急诊科' },
      { id: 2, name: '心内科' },
    ].filter((item) => item.name.includes(query))
  }
}

const submitForm = () => {
  console.log('提交数据：', formData.value)
}

const resetForm = () => {
  formData.value = {
    name: '',
    department: '',
    occurTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    faultType: '人为损坏',
    isHandled: false,
  }
}
</script>

<style scoped>
.el-input,
.el-select,
.el-date-editor {
  width: 300px;
}
</style>
