<template>
  <div class="not-found-container">
    <el-card class="not-found-card">
      <div class="error-content">
        <div class="error-img">
          <!-- <img src="@/assets/404.svg" alt="404" /> -->
        </div>
        <div class="error-info">
          <h1 class="error-title">404</h1>
          <h2 class="error-subtitle">页面不存在或已被移除</h2>
          <el-button type="primary" @click="goHome" class="back-btn">
            返回首页
          </el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<style scoped>
.not-found-container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f2f5;
}

.not-found-card {
  width: 600px;
  padding: 40px;
}

.error-content {
  display: flex;
  align-items: center;
}

.error-img {
  flex: 0 0 200px;
  margin-right: 40px;
}

.error-img img {
  width: 100%;
}

.error-info {
  flex: 1;
}

.error-title {
  font-size: 48px;
  color: #303133;
  margin-bottom: 20px;
}

.error-subtitle {
  font-size: 20px;
  color: #606266;
  margin-bottom: 30px;
}

.back-btn {
  width: 150px;
}
</style>
