import { createRouter, createMemoryHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('../views/Layout.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../views/Dashboard.vue'),
        meta: { title: '首页', icon: 'HomeFilled' },
      },
    ],
  },

  {
    path: '/purchase',
    name: 'Purchase',
    component: () => import('../views/Layout.vue'),
    meta: { title: '采购管理', icon: 'ShoppingCart' },
    children: [
      {
        path: 'plan',
        name: 'PurchasePlan',
        component: () => import('../views/purchase/PurchasePlan.vue'),
        meta: { title: '采购计划' },
      },
      {
        path: 'supplier',
        name: 'SupplierManagement',
        component: () => import('../views/purchase/SupplierManagement.vue'),
        meta: { title: '供应商管理' },
      },
      {
        path: 'equipment',
        name: 'SupplierEquipment',
        component: () => import('../views/purchase/SupplierEquipment.vue'),
        meta: { title: '供应商设备管理' },
      },
      {
        path: 'category',
        name: 'EquipmentCategory',
        component: () => import('../views/purchase/EquipmentCategory.vue'),
        meta: { title: '设备分类' },
      },
      {
        path: 'ledger',
        name: 'PurchaseLedger',
        component: () => import('../views/purchase/PurchaseLedger.vue'),
        meta: { title: '采购台账' },
      },
    ],
  },
  {
    path: '/warehouse',
    name: 'Warehouse',
    component: () => import('../views/Layout.vue'),
    meta: { title: '设备仓库', icon: 'House' },
    children: [
      {
        path: 'management',
        name: 'WarehouseManagement',
        component: () => import('../views/warehouse/WarehouseManagement.vue'),
        meta: { title: '仓库管理' },
      },
      {
        path: 'outbound',
        name: 'OutboundManagement',
        component: () => import('../views/warehouse/OutboundManagement.vue'),
        meta: { title: '出库管理' },
      },
      {
        path: 'inventory',
        name: 'InventoryManagement',
        component: () => import('../views/warehouse/InventoryManagement.vue'),
        meta: { title: '库存管理' },
      },
      {
        path: 'inbound',
        name: 'InboundManagement',
        component: () => import('../views/warehouse/InboundManagement.vue'),
        meta: { title: '入库管理' },
      },
    ],
  },
  {
    path: '/loan',
    name: 'Loan',
    component: () => import('../views/Layout.vue'),
    meta: { title: '借调中心', icon: 'Connection' },
    children: [
      {
        path: 'management',
        name: 'LoanManagement',
        component: () => import('../views/loan/LoanManagement.vue'),
        meta: { title: '借调管理' },
      },
      {
        path: 'statistics',
        name: 'LoanStatistics',
        component: () => import('../views/loan/LoanStatistics.vue'),
        meta: { title: '统计分析' },
      },
    ],
  },
  {
    path: '/aftersale',
    name: 'Aftersale',
    component: () => import('../views/Layout.vue'),
    meta: { title: '售后管理', icon: 'Service' },
    children: [
      {
        path: 'equipment',
        name: 'EquipmentManagement',
        component: () => import('../views/aftersale/EquipmentManagement.vue'),
        meta: { title: '设备管理' },
      },
      {
        path: 'repair',
        name: 'RepairTask',
        component: () => import('../views/aftersale/RepairTask.vue'),
        meta: { title: '维修任务' },
      },
      {
        path: 'knowledge',
        name: 'EquipmentKnowledge',
        component: () => import('../views/aftersale/EquipmentKnowledge.vue'),
        meta: { title: '设备知识库' },
      },
      {
        path: 'record',
        name: 'RepairRecord',
        component: () => import('../views/aftersale/RepairRecord.vue'),
        meta: { title: '维修记录' },
      },
      {
        path: 'inspection-plan',
        name: 'InspectionPlan',
        component: () => import('../views/aftersale/InspectionPlan.vue'),
        meta: { title: '巡检计划' },
      },
      {
        path: 'inspection-template',
        name: 'InspectionTemplate',
        component: () => import('../views/aftersale/InspectionTemplate.vue'),
        meta: { title: '巡检模版' },
      },
      {
        path: 'inspection-task',
        name: 'InspectionTask',
        component: () => import('../views/aftersale/InspectionTask.vue'),
        meta: { title: '巡检任务' },
      },
    ],
  },
  {
    path: '/quality',
    name: 'Quality',
    component: () => import('../views/Layout.vue'),
    meta: { title: '质控管理', icon: 'Aim' },
    children: [
      {
        path: 'bad-record',
        name: 'BadRecord',
        component: () => import('../views/quality/BadRecord.vue'),
        meta: { title: '不良记录' },
      },
      {
        path: 'exception',
        name: 'ExceptionManagement',
        component: () => import('../views/quality/ExceptionManagement.vue'),
        meta: { title: '异常管理' },
      },
      {
        path: 'test-record',
        name: 'TestRecord',
        component: () => import('../views/quality/TestRecord.vue'),
        meta: { title: '测试记录' },
      },
      {
        path: 'measurement',
        name: 'MeasurementManagement',
        component: () => import('../views/quality/MeasurementManagement.vue'),
        meta: { title: '计量管理' },
      },
    ],
  },
  {
    path: '/asset',
    name: 'Asset',
    component: () => import('../views/Layout.vue'),
    meta: { title: '资产管理', icon: 'Money' },
    children: [
      {
        path: 'scrap',
        name: 'AssetScrap',
        component: () => import('../views/asset/AssetScrap.vue'),
        meta: { title: '资产报废' },
      },
    ],
  },
  {
    path: '/system',
    name: 'System',
    component: () => import('../views/Layout.vue'),
    meta: { title: '系统管理', icon: 'Setting' },
    children: [
      {
        path: 'user',
        name: 'UserManagement',
        component: () => import('../views/system/UserManagement.vue'),
        meta: { title: '用户管理' },
      },
      {
        path: 'menu',
        name: 'MenuManagement',
        component: () => import('../views/system/MenuManagement.vue'),
        meta: { title: '菜单管理' },
      },
      {
        path: 'role',
        name: 'RoleManagement',
        component: () => import('../views/system/RoleManagement.vue'),
        meta: { title: '角色管理' },
      },
      {
        path: 'department',
        name: 'DepartmentManagement',
        component: () => import('../views/system/DepartmentManagement.vue'),
        meta: { title: '部门管理' },
      },
      {
        path: 'log',
        name: 'LogManagement',
        component: () => import('../views/system/LogManagement.vue'),
        meta: { title: '日志管理' },
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { title: '登录' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue'),
    meta: { title: '404' },
  },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title
    ? `${to.meta.title} - 医疗设备管理系统`
    : '医疗设备管理系统'

  // 判断是否需要登录权限
  const token = localStorage.getItem('token')
  if (to.path !== '/login' && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router
