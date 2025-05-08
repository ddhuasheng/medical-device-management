<template>
  <div class="app-container">
    <el-form ref="form" :model="formData" label-width="120px" :rules="rules">
      <el-form-item label="计划名称" prop="planName">
        <el-input v-model="formData.planName" placeholder="请输入计划名称" />
      </el-form-item>

      <el-form-item label="计划编号" prop="planCode">
        <el-input
          v-model="formData.planCode"
          placeholder="系统自动生成"
          disabled
        />
      </el-form-item>

      <el-form-item label="循环模式" prop="loopMode">
        <el-select v-model="formData.loopMode" placeholder="请选择循环模式">
          <el-option label="每天" value="daily" />
          <el-option label="每周" value="weekly" />
          <el-option label="每月" value="monthly" />
        </el-select>
      </el-form-item>

      <!-- 每日模式 -->
      <el-form-item
        v-if="formData.loopMode === 'daily'"
        label="执行时间"
        prop="dailyTime"
      >
        <el-time-picker
          v-model="formData.dailyTime"
          value-format="HH:mm"
          placeholder="选择每日执行时间"
        />
      </el-form-item>

      <!-- 每周模式 -->
      <div v-if="formData.loopMode === 'weekly'">
        <el-form-item label="选择星期" prop="weeklyDays">
          <el-checkbox-group v-model="formData.weeklyDays">
            <el-checkbox
              v-for="day in weekDays"
              :key="day.value"
              :label="day.value"
            >
              {{ day.label }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="执行时间" prop="weeklyTime">
          <el-time-picker
            v-model="formData.weeklyTime"
            value-format="HH:mm"
            placeholder="选择执行时间"
          />
        </el-form-item>
      </div>

      <!-- 每月模式 -->
      <div v-if="formData.loopMode === 'monthly'">
        <el-form-item label="每月日期" prop="monthlyDay">
          <el-input-number
            v-model="formData.monthlyDay"
            :min="1"
            :max="31"
            placeholder="输入日期"
          />
        </el-form-item>
        <el-form-item label="执行时间" prop="monthlyTime">
          <el-time-picker
            v-model="formData.monthlyTime"
            value-format="HH:mm"
            placeholder="选择执行时间"
          />
        </el-form-item>
      </div>

      <el-form-item label="计划内容" prop="content">
        <el-input
          v-model="formData.content"
          type="textarea"
          :rows="4"
          placeholder="请输入巡检内容"
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
import { ref, watch } from 'vue'
import dayjs from 'dayjs'

const formData = ref({
  planName: '',
  planCode: `INSP-${dayjs().format('YYYYMMDDHHmmss')}`,
  loopMode: 'daily',
  dailyTime: dayjs().format('HH:mm'),
  weeklyDays: [],
  weeklyTime: dayjs().format('HH:mm'),
  monthlyDay: 1,
  monthlyTime: dayjs().format('HH:mm'),
  content: '',
})

const weekDays = [
  { label: '周一', value: 1 },
  { label: '周二', value: 2 },
  { label: '周三', value: 3 },
  { label: '周四', value: 4 },
  { label: '周五', value: 5 },
  { label: '周六', value: 6 },
  { label: '周日', value: 0 },
]

const rules = {
  planName: [{ required: true, message: '请输入计划名称', trigger: 'blur' }],
  loopMode: [{ required: true, message: '请选择循环模式', trigger: 'change' }],
  dailyTime: [{ required: true, message: '请选择执行时间', trigger: 'change' }],
}

watch(
  () => formData.value.loopMode,
  (newVal) => {
    if (newVal === 'daily') {
      formData.value.weeklyDays = []
      formData.value.monthlyDay = 1
    } else if (newVal === 'weekly') {
      formData.value.monthlyDay = 1
    }
  }
)

const submitForm = () => {
  console.log('提交数据：', formData.value)
}

const resetForm = () => {
  formData.value = {
    planName: '',
    planCode: `INSP-${dayjs().format('YYYYMMDDHHmmss')}`,
    loopMode: 'daily',
    dailyTime: dayjs().format('HH:mm'),
    weeklyDays: [],
    weeklyTime: dayjs().format('HH:mm'),
    monthlyDay: 1,
    monthlyTime: dayjs().format('HH:mm'),
    content: '',
  }
}
</script>

<style scoped>
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
