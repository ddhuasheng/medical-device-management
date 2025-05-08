<template>
  <div class="app-container">
    <el-form ref="form" :model="formData" label-width="120px">
      <el-form-item label="模板名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入模板名称" />
      </el-form-item>

      <el-form-item label="模板编码" prop="code">
        <el-input
          v-model="formData.code"
          placeholder="自动生成"
          disabled
          @focus="generateTemplateCode"
        />
      </el-form-item>

      <el-form-item label="设备类型" prop="equipmentType">
        <el-select
          v-model="formData.equipmentType"
          filterable
          remote
          reserve-keyword
          placeholder="请选择设备类型"
          :remote-method="searchEquipmentType"
          @change="handleEquipmentTypeChange"
        >
          <el-option
            v-for="item in equipmentTypeOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="任务模板" prop="tasks">
        <div
          v-for="(task, index) in formData.tasks"
          :key="index"
          class="task-item"
        >
          <el-input
            v-model="task.name"
            placeholder="任务名称"
            style="width: 200px; margin-right: 10px"
          />
          <el-select
            v-model="task.method"
            placeholder="检测方式"
            style="width: 150px; margin-right: 10px"
          >
            <el-option
              v-for="method in inspectionMethods"
              :key="method.value"
              :label="method.label"
              :value="method.value"
            />
          </el-select>
          <el-input
            v-model="task.cycle"
            placeholder="检测周期（天）"
            style="width: 150px"
            type="number"
          />
          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            @click="removeTask(index)"
          />
        </div>
        <el-button type="primary" icon="el-icon-plus" @click="addTask"
          >添加任务</el-button
        >
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
        code: '',
        equipmentType: '',
        tasks: [],
      },
      equipmentTypeOptions: [],
      inspectionMethods: [
        { label: '人工检测', value: 'manual' },
        { label: '自动检测', value: 'auto' },
        { label: '混合检测', value: 'mixed' },
      ],
    }
  },
  methods: {
    generateTemplateCode() {
      if (!this.formData.code) {
        const timestamp = new Date().getTime().toString().slice(-6)
        this.formData.code = `TPL-${timestamp}`
      }
    },
    searchEquipmentType(query) {
      // 模拟设备类型搜索接口
      this.equipmentTypeOptions = query
        ? [
            { id: 'CT', name: 'CT设备' },
            { id: 'MRI', name: '核磁共振设备' },
          ]
        : []
    },
    handleEquipmentTypeChange(val) {
      console.log('Selected equipment type:', val)
    },
    addTask() {
      this.formData.tasks.push({
        name: '',
        method: '',
        cycle: '',
      })
    },
    removeTask(index) {
      this.formData.tasks.splice(index, 1)
    },
    submitForm() {
      console.log('模板数据：', JSON.stringify(this.formData))
      this.$message.success('提交成功')
    },
    resetForm() {
      this.$refs.form.resetFields()
      this.formData.tasks = []
    },
  },
}
</script>

<style scoped>
.app-container {
  padding: 20px;
}
.task-item {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
}
.el-input {
  width: 300px;
}
.el-select {
  width: 300px;
}
</style>
