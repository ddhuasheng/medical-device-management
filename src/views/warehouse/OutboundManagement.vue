<template>
  <div class="outbound-management-container">
    <div class="page-header">
      <h2>出库管理</h2>
      <el-button type="primary" @click="openDialog('add')">新增出库</el-button>
    </div>

    <!-- 搜索区域 -->
    <div class="search-container">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="仓库名称">
          <el-select
            v-model="searchForm.warehouseId"
            placeholder="请选择仓库"
            clearable
          >
            <el-option
              v-for="item in warehouseOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="设备名称">
          <el-input
            v-model="searchForm.equipmentName"
            placeholder="请输入设备名称"
            clearable
          />
        </el-form-item>
        <el-form-item label="领用科室">
          <el-select
            v-model="searchForm.departmentId"
            placeholder="请选择科室"
            clearable
          >
            <el-option
              v-for="item in departmentOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="searchForm.status"
            placeholder="请选择状态"
            clearable
          >
            <el-option label="已出库" value="已出库" />
            <el-option label="待审核" value="待审核" />
            <el-option label="已作废" value="已作废" />
            <el-option label="驳回" value="驳回" />
          </el-select>
        </el-form-item>
        <el-form-item label="出库时间">
          <el-date-picker
            v-model="searchForm.outboundTimeRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 表格区域 -->
    <el-table :data="tableData" border style="width: 100%" v-loading="loading">
      <el-table-column prop="id" label="出库单号" width="120" />
      <el-table-column prop="warehouseName" label="仓库名称" width="120" />
      <el-table-column prop="equipmentName" label="设备名称" width="120" />
      <el-table-column prop="quantity" label="数量" width="80" />
      <el-table-column prop="recipientName" label="领用人" width="100" />
      <el-table-column prop="departmentName" label="领用科室" width="120" />
      <el-table-column prop="outboundTime" label="出库时间" width="180" />
      <el-table-column prop="purpose" label="用途" width="100">
        <template #default="scope">
          <el-tag v-if="scope.row.purpose === '借调'" type="primary"
            >借调</el-tag
          >
          <el-tag v-else-if="scope.row.purpose === '科室自用'" type="success"
            >科室自用</el-tag
          >
          <el-tag v-else-if="scope.row.purpose === '退货'" type="warning"
            >退货</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column prop="responsiblePerson" label="责任人" width="100" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="scope">
          <el-tag v-if="scope.row.status === '已出库'" type="success"
            >已出库</el-tag
          >
          <el-tag v-else-if="scope.row.status === '待审核'" type="warning"
            >待审核</el-tag
          >
          <el-tag v-else-if="scope.row.status === '已作废'" type="info"
            >已作废</el-tag
          >
          <el-tag v-else-if="scope.row.status === '驳回'" type="danger"
            >驳回</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="scope">
          <el-button
            size="small"
            type="primary"
            @click="openDialog('view', scope.row)"
            >查看</el-button
          >
          <el-button
            size="small"
            type="success"
            @click="openDialog('edit', scope.row)"
            v-if="scope.row.status === '待审核'"
            >编辑</el-button
          >
          <el-button
            size="small"
            type="danger"
            @click="handleDelete(scope.row)"
            v-if="scope.row.status === '待审核'"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 新增/编辑/查看对话框 -->
    <el-dialog
      :title="
        dialogType === 'add'
          ? '新增出库'
          : dialogType === 'edit'
          ? '编辑出库'
          : '查看出库详情'
      "
      v-model="dialogVisible"
      width="650px"
    >
      <el-form
        :model="form"
        :rules="rules"
        ref="formRef"
        label-width="100px"
        :disabled="dialogType === 'view'"
      >
        <el-form-item label="仓库名称" prop="warehouseId">
          <el-select
            v-model="form.warehouseId"
            placeholder="请选择仓库"
            style="width: 100%"
          >
            <el-option
              v-for="item in warehouseOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="设备名称" prop="equipmentId">
          <el-select
            v-model="form.equipmentId"
            placeholder="请选择设备"
            style="width: 100%"
          >
            <el-option
              v-for="item in equipmentOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="数量" prop="quantity">
          <el-input-number
            v-model="form.quantity"
            :min="1"
            :max="999"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="领用人" prop="recipientName">
          <el-input v-model="form.recipientName" placeholder="请输入领用人" />
        </el-form-item>
        <el-form-item label="领用科室" prop="departmentId">
          <el-select
            v-model="form.departmentId"
            placeholder="请选择科室"
            style="width: 100%"
          >
            <el-option
              v-for="item in departmentOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="出库时间" prop="outboundTime">
          <el-date-picker
            v-model="form.outboundTime"
            type="datetime"
            placeholder="选择日期时间"
            style="width: 100%"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="用途" prop="purpose">
          <el-select
            v-model="form.purpose"
            placeholder="请选择用途"
            style="width: 100%"
          >
            <el-option label="借调" value="借调" />
            <el-option label="科室自用" value="科室自用" />
            <el-option label="退货" value="退货" />
          </el-select>
        </el-form-item>
        <el-form-item label="责任人" prop="responsiblePerson">
          <el-input
            v-model="form.responsiblePerson"
            placeholder="请输入责任人"
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            placeholder="请输入备注"
            :rows="3"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            @click="handleSubmit"
            v-if="dialogType !== 'view'"
            >确定</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 搜索表单
const searchForm = reactive({
  warehouseId: '',
  equipmentName: '',
  departmentId: '',
  status: '',
  outboundTimeRange: [],
})

// 表格数据
const tableData = ref([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 对话框相关
const dialogVisible = ref(false)
const dialogType = ref('add') // add, edit, view
const formRef = ref(null)

// 表单数据
const form = reactive({
  id: '',
  warehouseId: '',
  equipmentId: '',
  quantity: 1,
  recipientName: '',
  departmentId: '',
  outboundTime: '',
  purpose: '',
  responsiblePerson: '',
  status: '待审核',
  remark: '',
})

// 表单验证规则
const rules = {
  warehouseId: [{ required: true, message: '请选择仓库', trigger: 'change' }],
  equipmentId: [{ required: true, message: '请选择设备', trigger: 'change' }],
  quantity: [{ required: true, message: '请输入数量', trigger: 'blur' }],
  recipientName: [{ required: true, message: '请输入领用人', trigger: 'blur' }],
  departmentId: [
    { required: true, message: '请选择领用科室', trigger: 'change' },
  ],
  outboundTime: [
    { required: true, message: '请选择出库时间', trigger: 'change' },
  ],
  purpose: [{ required: true, message: '请选择用途', trigger: 'change' }],
  responsiblePerson: [
    { required: true, message: '请输入责任人', trigger: 'blur' },
  ],
}

// 选项数据
const warehouseOptions = ref([
  { id: 1, name: '医疗设备仓库' },
  { id: 2, name: '耗材仓库' },
])

const equipmentOptions = ref([
  { id: 1, name: '呼吸机', model: 'HX-100' },
  { id: 2, name: '心电监护仪', model: 'ECG-200' },
  { id: 3, name: '超声诊断仪', model: 'US-300' },
  { id: 4, name: '血液分析仪', model: 'BA-400' },
])

const departmentOptions = ref([
  { id: 1, name: '内科' },
  { id: 2, name: '外科' },
  { id: 3, name: '儿科' },
  { id: 4, name: '妇产科' },
  { id: 5, name: '急诊科' },
])

// 初始化数据
onMounted(() => {
  fetchData()
})

// 获取表格数据
const fetchData = () => {
  loading.value = true
  // 模拟接口请求
  setTimeout(() => {
    tableData.value = [
      {
        id: 'CK20230001',
        warehouseId: 1,
        warehouseName: '医疗设备仓库',
        equipmentId: 1,
        equipmentName: '呼吸机',
        quantity: 2,
        recipientName: '张医生',
        departmentId: 1,
        departmentName: '内科',
        outboundTime: '2023-06-15 09:30:00',
        purpose: '科室自用',
        responsiblePerson: '李主任',
        status: '已出库',
        remark: '内科急需使用',
      },
      {
        id: 'CK20230002',
        warehouseId: 1,
        warehouseName: '医疗设备仓库',
        equipmentId: 2,
        equipmentName: '心电监护仪',
        quantity: 1,
        recipientName: '王医生',
        departmentId: 5,
        departmentName: '急诊科',
        outboundTime: '2023-06-18 14:20:00',
        purpose: '科室自用',
        responsiblePerson: '赵主任',
        status: '已出库',
        remark: '急诊科设备更新',
      },
      {
        id: 'CK20230003',
        warehouseId: 1,
        warehouseName: '医疗设备仓库',
        equipmentId: 3,
        equipmentName: '超声诊断仪',
        quantity: 1,
        recipientName: '刘医生',
        departmentId: 4,
        departmentName: '妇产科',
        outboundTime: '2023-06-20 10:15:00',
        purpose: '借调',
        responsiblePerson: '陈主任',
        status: '待审核',
        remark: '临时借用一周',
      },
      {
        id: 'CK20230004',
        warehouseId: 2,
        warehouseName: '耗材仓库',
        equipmentId: 4,
        equipmentName: '血液分析仪',
        quantity: 1,
        recipientName: '孙医生',
        departmentId: 2,
        departmentName: '外科',
        outboundTime: '2023-06-22 16:45:00',
        purpose: '退货',
        responsiblePerson: '吴主任',
        status: '已作废',
        remark: '设备存在质量问题',
      },
    ]
    total.value = 4
    loading.value = false
  }, 500)
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  fetchData()
}

// 重置搜索
const resetSearch = () => {
  Object.keys(searchForm).forEach((key) => {
    searchForm[key] = ''
  })
  searchForm.outboundTimeRange = []
  handleSearch()
}

// 分页大小变化
const handleSizeChange = (val) => {
  pageSize.value = val
  fetchData()
}

// 当前页变化
const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchData()
}

// 打开对话框
const openDialog = (type, row) => {
  dialogType.value = type
  dialogVisible.value = true

  // 重置表单
  if (formRef.value) {
    formRef.value.resetFields()
  }

  if (type === 'add') {
    Object.keys(form).forEach((key) => {
      if (key !== 'quantity' && key !== 'status') {
        form[key] = ''
      }
    })
    form.quantity = 1
    form.status = '待审核'
    form.outboundTime = new Date().toISOString().slice(0, 19).replace('T', ' ')
  } else {
    // 编辑或查看，填充表单数据
    Object.keys(form).forEach((key) => {
      if (key in row) {
        form[key] = row[key]
      }
    })
  }
}

// 提交表单
const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      // 模拟提交
      ElMessage.success(dialogType.value === 'add' ? '新增成功' : '修改成功')
      dialogVisible.value = false
      fetchData()
    }
  })
}

// 删除
const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除该出库记录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      // 模拟删除
      ElMessage.success('删除成功')
      fetchData()
    })
    .catch(() => {})
}
</script>

<style scoped>
.outbound-management-container {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-container {
  margin-bottom: 20px;
  padding: 18px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
