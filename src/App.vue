<script setup>
// 不需要在这里导入路由，因为main.js中已经全局注册了路由
</script>

<template>
  <router-view />
</template>

<style>
/* 全局样式 */
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
    'Microsoft YaHei', Arial, sans-serif;
}

#app {
  height: 100%;
}
</style>
