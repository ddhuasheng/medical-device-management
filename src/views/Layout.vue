<template>
  <div class="layout-container">
    <!-- 侧边栏 -->
    <el-aside width="220px" class="aside">
      <div class="logo-container">
        <!-- <img src="../assets/logo.png" alt="Logo" class="logo" v-if="logoUrl" /> -->
        <h1 class="title">医疗设备管理系统</h1>
      </div>
      <el-scrollbar>
        <el-menu
          :default-active="activeMenu"
          class="el-menu-vertical"
          :collapse="isCollapse"
          background-color="#304156"
          text-color="#bfcbd9"
          active-text-color="#409EFF"
          router
        >
          <template v-for="(route, index) in routes" :key="index">
            <!-- 没有子路由的菜单 -->
            <el-menu-item
              v-if="!route.children && !route.hidden"
              :index="route.path"
            >
              <el-icon v-if="route.meta && route.meta.icon">
                <component :is="route.meta.icon"></component>
              </el-icon>
              <template #title>{{
                route.meta ? route.meta.title : route.name
              }}</template>
            </el-menu-item>

            <!-- 有子路由的菜单 -->
            <el-sub-menu
              v-else-if="!route.hidden && route.children"
              :index="route.path"
            >
              <template #title>
                <el-icon v-if="route.meta && route.meta.icon">
                  <component :is="route.meta.icon"></component>
                </el-icon>
                <span>{{ route.meta ? route.meta.title : route.name }}</span>
              </template>
              <el-menu-item
                v-for="(subRoute, subIndex) in route.children"
                :key="subIndex"
                :index="route.path + '/' + subRoute.path"
              >
                <el-icon v-if="subRoute.meta && subRoute.meta.icon">
                  <component :is="subRoute.meta.icon"></component>
                </el-icon>
                <template #title>{{
                  subRoute.meta ? subRoute.meta.title : subRoute.name
                }}</template>
              </el-menu-item>
            </el-sub-menu>
          </template>
        </el-menu>
      </el-scrollbar>
    </el-aside>

    <el-container class="main-container">
      <!-- 顶部导航栏 -->
      <el-header class="header">
        <div class="header-left">
          <el-icon class="collapse-btn" @click="toggleSidebar">
            <Fold v-if="!isCollapse" />
            <Expand v-else />
          </el-icon>
          <el-breadcrumb separator="/" class="breadcrumb">
            <el-breadcrumb-item :to="{ path: '/dashboard' }"
              >首页</el-breadcrumb-item
            >
            <el-breadcrumb-item
              v-if="currentRoute.meta && currentRoute.meta.title"
            >
              {{ currentRoute.meta.title }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <el-dropdown trigger="click">
            <div class="avatar-container">
              <el-avatar :size="32" :src="avatarUrl" />
              <span class="username">{{ username }}</span>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="goToProfile"
                  >个人信息</el-dropdown-item
                >
                <el-dropdown-item @click="changePassword"
                  >修改密码</el-dropdown-item
                >
                <el-dropdown-item divided @click="logout"
                  >退出登录</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <!-- 主要内容区域 -->
      <el-main class="main">
        <router-view v-slot="{ Component }">
          <transition name="fade-transform" mode="out-in">
            <keep-alive>
              <component :is="Component" />
            </keep-alive>
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Fold, Expand } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

// 侧边栏折叠状态
const isCollapse = ref(false)
const toggleSidebar = () => {
  isCollapse.value = !isCollapse.value
}

// 用户信息
const username = ref('管理员')
const avatarUrl = ref('')
const logoUrl = ref('')

// 获取路由
const routes = computed(() => {
  return router.options.routes.filter(
    (route) =>
      !route.hidden &&
      route.path !== '/login' &&
      route.path !== '/:pathMatch(.*)*'
  )
})

// 当前激活的菜单
const activeMenu = computed(() => {
  const { meta, path } = route
  if (meta.activeMenu) {
    return meta.activeMenu
  }
  return path
})

// 当前路由
const currentRoute = computed(() => {
  return route
})

// 用户操作
const goToProfile = () => {
  // 跳转到个人信息页面
  console.log('跳转到个人信息页面')
}

const changePassword = () => {
  // 修改密码
  console.log('修改密码')
}

const logout = () => {
  // 清除token
  localStorage.removeItem('token')
  // 跳转到登录页
  router.push('/login')
}

onMounted(() => {
  // 这里可以获取用户信息
  console.log('Layout组件已挂载')
})
</script>

<style scoped>
.layout-container {
  height: 100vh;
  width: 100%;
  display: flex;
}

.aside {
  background-color: #1f2d3d;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.el-menu-vertical {
  border-right: none;
}

.el-menu-item {
  margin: 4px 8px;
  border-radius: 4px;
  transition: all 0.3s;
}

.el-menu-item.is-active {
  background-color: rgba(64, 158, 255, 0.1);
}

.header {
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  z-index: 1;
}

@media (max-width: 768px) {
  .aside {
    position: fixed;
    z-index: 1000;
    left: -220px;
    transition: left 0.3s;
  }

  .aside.is-collapse {
    left: 0;
  }
}
.logo-container {
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  background-color: #2b3649;
}

.logo {
  width: 32px;
  height: 32px;
  margin-right: 10px;
}

.title {
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.el-menu-vertical:not(.el-menu--collapse) {
  width: 220px;
}

.header {
  height: 64px;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
}

.breadcrumb {
  font-size: 16px;
  margin-left: 16px;
}

.avatar-container {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.username {
  font-size: 14px;
  color: #606266;
}

.collapse-btn {
  font-size: 20px;
  cursor: pointer;
  color: #666;
}

.main-container {
  height: 100%;
  flex: 1;
  overflow: auto;
}

.main {
  padding: 20px;
  background-color: #f0f2f5;
}

/* 路由切换动画 */
.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.3s;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
