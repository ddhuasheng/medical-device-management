<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const formData = ref({
  deviceName: '',
  applicant: '',
  applyDepartment: '',
  loanTime: '',
  expectReturnTime: '',
  responsiblePerson: '',
  responsibleDepartment: '',
  status: 'pending',
})

const statusOptions = [
  { label: '待确认', value: 'pending' },
  { label: '已借调', value: 'loaned' },
  { label: '驳回', value: 'rejected' },
  { label: '已归还', value: 'returned' },
  { label: '已逾期', value: 'overdue' },
]

const departments = ref(['心血管科', '急诊科', '放射科', '检验科'])

// 新增负责人字段验证
const rules = {
  deviceName: [{ required: true, message: '请选择设备', trigger: 'blur' }],
  applicant: [{ required: true, message: '请输入申请人', trigger: 'blur' }],
  applyDepartment: [
    { required: true, message: '请选择申请科室', trigger: 'change' },
  ],
  loanTime: [
    {
      type: 'date',
      required: true,
      message: '请选择借调时间',
      trigger: 'change',
    },
  ],
  expectReturnTime: [
    {
      type: 'date',
      required: true,
      validator: (rule, value) => value > formData.value.loanTime,
      message: '预归还时间必须晚于借调时间',
    },
  ],
  responsiblePerson: [
    {
      required: true,
      message: '请输入负责人',
      trigger: 'blur',
    },
  ],
  responsibleDepartment: [
    {
      required: true,
      message: '请选择负责科室',
      trigger: 'change',
    },
  ],
}

// 完善状态处理逻辑
const handleStatusChange = (newStatus) => {
  if (newStatus === 'rejected') {
    ElMessage.warning('申请已驳回')
  } else if (newStatus === 'returned') {
    ElMessage.success('设备已归还')
  }
}
</script>

<template>
  <div class="loan-management">
    <el-card>
      <el-form :model="formData" :rules="rules" label-width="120px">
        <!-- 表单字段部分 -->
        <el-form-item label="设备名称" prop="deviceName">
          <el-input v-model="formData.deviceName" />
        </el-form-item>

        <el-form-item label="申请人" prop="applicant">
          <el-input v-model="formData.applicant" />
        </el-form-item>

        <el-form-item label="申请科室" prop="applyDepartment">
          <el-select v-model="formData.applyDepartment">
            <el-option
              v-for="dept in departments"
              :key="dept"
              :label="dept"
              :value="dept"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="借调时间" prop="loanTime">
          <el-date-picker
            v-model="formData.loanTime"
            type="datetime"
            placeholder="选择日期时间"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>

        <el-form-item label="预归还时间" prop="expectReturnTime">
          <el-date-picker
            v-model="formData.expectReturnTime"
            type="datetime"
            placeholder="选择日期时间"
            :disabled-date="(time) => time < formData.loanTime"
          />
        </el-form-item>

        <el-form-item label="设备状态" prop="status">
          <el-select v-model="formData.status">
            <el-option
              v-for="status in statusOptions"
              :key="status.value"
              :label="status.label"
              :value="status.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit">提交</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
.loan-management {
  padding: 20px;
}
.el-form {
  max-width: 800px;
}
</style>
