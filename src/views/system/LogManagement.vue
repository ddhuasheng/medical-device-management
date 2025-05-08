<template>
  <div class="log-management-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>操作日志</span>
          <el-button type="primary" @click="handleRefresh">刷新</el-button>
        </div>
      </template>

      <el-table :data="logList" border style="width: 100%">
        <el-table-column prop="time" label="时间" width="180" />
        <el-table-column prop="operator" label="操作人" width="120" />
        <el-table-column prop="module" label="操作模块" width="150" />
        <el-table-column prop="action" label="操作类型" />
        <el-table-column prop="detail" label="操作详情" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const logList = ref([
  {
    time: '2024-03-15 09:30',
    operator: '管理员',
    module: '用户管理',
    action: '新增用户',
    detail: '新增用户：李四（技术部）',
  },
  {
    time: '2024-03-15 10:15',
    operator: '王五',
    module: '角色管理',
    action: '权限修改',
    detail: '修改"财务角色"权限配置',
  },
])

const handleRefresh = () => {
  console.log('刷新日志列表')
}
</script>

<style scoped>
.log-management-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
