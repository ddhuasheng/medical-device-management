<template>
  <div class="app-container">
    <el-form ref="form" :model="formData" label-width="120px">
      <!-- 任务发起人 -->
      <el-form-item label="任务发起人">
        <el-select
          v-model="formData.creator"
          filterable
          placeholder="请选择发起人"
        >
          <el-option
            v-for="user in userOptions"
            :key="user.id"
            :label="user.name"
            :value="user.id"
          />
        </el-select>
      </el-form-item>

      <!-- 维修人员 -->
      <el-form-item label="维修人员">
        <el-select
          v-model="formData.maintainer"
          multiple
          filterable
          placeholder="请选择维修人员"
        >
          <el-option
            v-for="user in maintainerOptions"
            :key="user.id"
            :label="user.name"
            :value="user.id"
          />
        </el-select>
      </el-form-item>

      <!-- 维修时间 -->
      <el-form-item label="维修时间">
        <el-date-picker
          v-model="formData.maintainTime"
          type="datetime"
          placeholder="选择日期时间"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>

      <!-- 维修结果 -->
      <el-form-item label="维修结果">
        <el-input
          v-model="formData.result"
          type="textarea"
          :rows="4"
          placeholder="请输入详细维修结果"
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
        creator: '',
        maintainer: [],
        maintainTime: '',
        result: '',
      },
      // 模拟用户数据（后续需对接用户管理模块）
      userOptions: [
        { id: 1, name: '张三', role: '发起人' },
        { id: 2, name: '李四', role: '发起人' },
      ],
      maintainerOptions: [
        { id: 3, name: '王师傅', role: '维修员' },
        { id: 4, name: '赵工程师', role: '维修员' },
      ],
    }
  },
  methods: {
    submitForm() {
      console.log('提交维修记录：', this.formData)
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
