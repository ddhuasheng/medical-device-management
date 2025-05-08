<template>
  <div class="supplier-management-container">
    <!-- 搜索区域 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="供应商名称">
          <el-input
            v-model="searchForm.supplierName"
            placeholder="请输入供应商名称"
            clearable
          />
        </el-form-item>
        <el-form-item label="联系人">
          <el-input
            v-model="searchForm.contactPerson"
            placeholder="请输入联系人"
            clearable
          />
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input
            v-model="searchForm.contactPhone"
            placeholder="请输入联系电话"
            clearable
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="searchForm.status"
            placeholder="请选择状态"
            clearable
          >
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格工具栏 -->
    <div class="table-toolbar">
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>新增供应商
      </el-button>
      <el-button
        type="danger"
        :disabled="!selectedRows.length"
        @click="handleBatchDelete"
      >
        <el-icon><Delete /></el-icon>批量删除
      </el-button>
      <el-button type="success" @click="handleExport">
        <el-icon><Download /></el-icon>导出
      </el-button>
    </div>

    <!-- 表格区域 -->
    <el-card class="table-card">
      <el-table
        v-loading="loading"
        :data="tableData"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="supplierCode" label="供应商编码" width="120" />
        <el-table-column prop="supplierName" label="供应商名称" width="180" />
        <el-table-column prop="contactPerson" label="联系人" width="100" />
        <el-table-column prop="contactPhone" label="联系电话" width="120" />
        <el-table-column prop="email" label="电子邮箱" width="150" />
        <el-table-column
          prop="address"
          label="地址"
          width="200"
          show-overflow-tooltip
        />
        <el-table-column prop="businessLicense" label="营业执照" width="120">
          <template #default="scope">
            <el-button
              type="primary"
              link
              @click="viewLicense(scope.row)"
              v-if="scope.row.businessLicense"
            >
              查看
            </el-button>
            <span v-else>未上传</span>
          </template>
        </el-table-column>
        <el-table-column prop="qualificationCert" label="资质证书" width="120">
          <template #default="scope">
            <el-button
              type="primary"
              link
              @click="viewQualification(scope.row)"
              v-if="scope.row.qualificationCert"
            >
              查看
            </el-button>
            <span v-else>未上传</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusLabel(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="150" />
        <el-table-column label="操作" fixed="right" width="200">
          <template #default="scope">
            <el-button type="primary" link @click="handleView(scope.row)">
              查看
            </el-button>
            <el-button type="primary" link @click="handleEdit(scope.row)">
              编辑
            </el-button>
            <el-button type="danger" link @click="handleDelete(scope.row)">
              删除
            </el-button>
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
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      :title="dialogType === 'add' ? '新增供应商' : '编辑供应商'"
      v-model="dialogVisible"
      width="700px"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="供应商编码" prop="supplierCode">
              <el-input
                v-model="form.supplierCode"
                placeholder="请输入供应商编码"
                :disabled="dialogType === 'edit'"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="供应商名称" prop="supplierName">
              <el-input
                v-model="form.supplierName"
                placeholder="请输入供应商名称"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="联系人" prop="contactPerson">
              <el-input
                v-model="form.contactPerson"
                placeholder="请输入联系人"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="contactPhone">
              <el-input
                v-model="form.contactPhone"
                placeholder="请输入联系电话"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="电子邮箱" prop="email">
              <el-input v-model="form.email" placeholder="请输入电子邮箱" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-select v-model="form.status" placeholder="请选择状态">
                <el-option
                  v-for="item in statusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入地址" />
        </el-form-item>
        <el-form-item label="营业执照" prop="businessLicense">
          <el-upload
            class="upload-demo"
            action="#"
            :auto-upload="false"
            :on-change="handleLicenseChange"
            :limit="1"
          >
            <template #trigger>
              <el-button type="primary">选择文件</el-button>
            </template>
            <template #tip>
              <div class="el-upload__tip">
                请上传营业执照，支持JPG、PNG、PDF格式
              </div>
            </template>
          </el-upload>
        </el-form-item>
        <el-form-item label="资质证书" prop="qualificationCert">
          <el-upload
            class="upload-demo"
            action="#"
            :auto-upload="false"
            :on-change="handleQualificationChange"
            :limit="1"
          >
            <template #trigger>
              <el-button type="primary">选择文件</el-button>
            </template>
            <template #tip>
              <div class="el-upload__tip">
                请上传资质证书，支持JPG、PNG、PDF格式
              </div>
            </template>
          </el-upload>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            placeholder="请输入备注信息"
            :rows="3"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 查看详情对话框 -->
    <el-dialog title="供应商详情" v-model="viewDialogVisible" width="700px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="供应商编码">{{
          viewForm.supplierCode
        }}</el-descriptions-item>
        <el-descriptions-item label="供应商名称">{{
          viewForm.supplierName
        }}</el-descriptions-item>
        <el-descriptions-item label="联系人">{{
          viewForm.contactPerson
        }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{
          viewForm.contactPhone
        }}</el-descriptions-item>
        <el-descriptions-item label="电子邮箱">{{
          viewForm.email
        }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusType(viewForm.status)">
            {{ getStatusLabel(viewForm.status) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="地址" :span="2">{{
          viewForm.address
        }}</el-descriptions-item>
        <el-descriptions-item label="营业执照" :span="2">
          <el-button
            type="primary"
            link
            @click="viewLicense(viewForm)"
            v-if="viewForm.businessLicense"
          >
            查看
          </el-button>
          <span v-else>未上传</span>
        </el-descriptions-item>
        <el-descriptions-item label="资质证书" :span="2">
          <el-button
            type="primary"
            link
            @click="viewQualification(viewForm)"
            v-if="viewForm.qualificationCert"
          >
            查看
          </el-button>
          <span v-else>未上传</span>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">{{
          viewForm.createTime
        }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{
          viewForm.updateTime
        }}</el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">{{
          viewForm.remark
        }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Delete, Download } from '@element-plus/icons-vue'

// 状态选项
const statusOptions = [
  { value: 'active', label: '正常' },
  { value: 'inactive', label: '禁用' },
]

// 获取状态标签类型
const getStatusType = (status) => {
  switch (status) {
    case 'active':
      return 'success'
    case 'inactive':
      return 'info'
    default:
      return 'info'
  }
}

// 获取状态标签文本
const getStatusLabel = (status) => {
  const found = statusOptions.find((item) => item.value === status)
  return found ? found.label : status
}

// 搜索表单
const searchForm = reactive({
  supplierName: '',
  contactPerson: '',
  contactPhone: '',
  status: '',
})

// 重置搜索
const resetSearch = () => {
  searchForm.supplierName = ''
  searchForm.contactPerson = ''
  searchForm.contactPhone = ''
  searchForm.status = ''
  handleSearch()
}

// 处理搜索
const handleSearch = () => {
  currentPage.value = 1
  fetchData()
}

// 表格数据
const loading = ref(false)
const tableData = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const selectedRows = ref([])

// 模拟获取数据
const fetchData = () => {
  loading.value = true
  // 这里应该是调用API获取数据
  setTimeout(() => {
    // 模拟数据
    const mockData = [
      {
        id: 1,
        supplierCode: 'GYS20230001',
        supplierName: '北京医疗设备有限公司',
        contactPerson: '张三',
        contactPhone: '13800138001',
        email: 'zhangsan@example.com',
        address: '北京市海淀区中关村南大街5号',
        businessLicense: 'license1.pdf',
        qualificationCert: 'cert1.pdf',
        status: 'active',
        createTime: '2023-06-15 10:30:00',
        updateTime: '2023-06-15 10:30:00',
        remark: '主要提供CT、MRI等大型医疗设备',
      },
      {
        id: 2,
        supplierCode: 'GYS20230002',
        supplierName: '上海医疗器械有限公司',
        contactPerson: '李四',
        contactPhone: '13900139002',
        email: 'lisi@example.com',
        address: '上海市浦东新区张江高科技园区',
        businessLicense: 'license2.pdf',
        qualificationCert: 'cert2.pdf',
        status: 'active',
        createTime: '2023-06-20 14:20:00',
        updateTime: '2023-06-20 14:20:00',
        remark: '专注于手术器械和医疗耗材',
      },
      {
        id: 3,
        supplierCode: 'GYS20230003',
        supplierName: '广州医疗科技有限公司',
        contactPerson: '王五',
        contactPhone: '13700137003',
        email: 'wangwu@example.com',
        address: '广州市天河区珠江新城',
        businessLicense: 'license3.pdf',
        qualificationCert: 'cert3.pdf',
        status: 'inactive',
        createTime: '2023-07-05 09:15:00',
        updateTime: '2023-07-10 16:30:00',
        remark: '提供各类医疗监护设备',
      },
    ]

    // 过滤数据
    let filteredData = [...mockData]
    if (searchForm.supplierName) {
      filteredData = filteredData.filter((item) =>
        item.supplierName.includes(searchForm.supplierName)
      )
    }
    if (searchForm.contactPerson) {
      filteredData = filteredData.filter((item) =>
        item.contactPerson.includes(searchForm.contactPerson)
      )
    }
    if (searchForm.contactPhone) {
      filteredData = filteredData.filter((item) =>
        item.contactPhone.includes(searchForm.contactPhone)
      )
    }
    if (searchForm.status) {
      filteredData = filteredData.filter(
        (item) => item.status === searchForm.status
      )
    }

    // 分页
    total.value = filteredData.length
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    tableData.value = filteredData.slice(start, end)
    loading.value = false
  }, 500)
}

// 处理表格选择变化
const handleSelectionChange = (rows) => {
  selectedRows.value = rows
}

// 处理分页大小变化
const handleSizeChange = (size) => {
  pageSize.value = size
  fetchData()
}

// 处理页码变化
const handleCurrentChange = (page) => {
  currentPage.value = page
  fetchData()
}

// 对话框相关
const dialogVisible = ref(false)
const dialogType = ref('add')
const formRef = ref(null)
const viewDialogVisible = ref(false)

// 表单数据
const form = reactive({
  id: null,
  supplierCode: '',
  supplierName: '',
  contactPerson: '',
  contactPhone: '',
  email: '',
  address: '',
  businessLicense: null,
  qualificationCert: null,
  status: 'active',
  remark: '',
})

// 查看表单数据
const viewForm = reactive({
  id: null,
  supplierCode: '',
  supplierName: '',
  contactPerson: '',
  contactPhone: '',
  email: '',
  address: '',
  businessLicense: null,
  qualificationCert: null,
  status: '',
  createTime: '',
  updateTime: '',
  remark: '',
})

// 表单验证规则
const rules = {
  supplierCode: [
    { required: true, message: '请输入供应商编码', trigger: 'blur' },
  ],
  supplierName: [
    { required: true, message: '请输入供应商名称', trigger: 'blur' },
  ],
  contactPerson: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
  contactPhone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: '请输入正确的手机号码',
      trigger: 'blur',
    },
  ],
  email: [
    { required: true, message: '请输入电子邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' },
  ],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
}

// 处理新增
const handleAdd = () => {
  dialogType.value = 'add'
  resetForm()
  dialogVisible.value = true
}

// 处理编辑
const handleEdit = (row) => {
  dialogType.value = 'edit'
  resetForm()
  Object.assign(form, row)
  dialogVisible.value = true
}

// 处理查看
const handleView = (row) => {
  Object.assign(viewForm, row)
  viewDialogVisible.value = true
}

// 重置表单
const resetForm = () => {
  form.id = null
  form.supplierCode = ''
  form.supplierName = ''
  form.contactPerson = ''
  form.contactPhone = ''
  form.email = ''
  form.address = ''
  form.businessLicense = null
  form.qualificationCert = null
  form.status = 'active'
  form.remark = ''
}

// 提交表单
const submitForm = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      // 这里应该是调用API保存数据
      ElMessage.success(dialogType.value === 'add' ? '新增成功' : '编辑成功')
      dialogVisible.value = false
      fetchData()
    }
  })
}

// 处理删除
const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除该供应商吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      // 这里应该是调用API删除数据
      ElMessage.success('删除成功')
      fetchData()
    })
    .catch(() => {})
}

// 处理批量删除
const handleBatchDelete = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择要删除的供应商')
    return
  }
  ElMessageBox.confirm(
    `确定要删除选中的 ${selectedRows.value.length} 个供应商吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      // 这里应该是调用API批量删除数据
      ElMessage.success('批量删除成功')
      fetchData()
    })
    .catch(() => {})
}

// 处理导出
const handleExport = () => {
  ElMessage.success('导出成功')
}

// 处理营业执照文件变更
const handleLicenseChange = (file) => {
  form.businessLicense = file.raw
}

// 处理资质证书文件变更
const handleQualificationChange = (file) => {
  form.qualificationCert = file.raw
}

// 查看营业执照
const viewLicense = (row) => {
  // 这里应该是调用API获取文件并预览
  ElMessage.info('查看营业执照：' + row.businessLicense)
}

// 查看资质证书
const viewQualification = (row) => {
  // 这里应该是调用API获取文件并预览
  ElMessage.info('查看资质证书：' + row.qualificationCert)
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.supplier-management-container {
  padding: 20px;
}

.search-card {
  margin-bottom: 20px;
}

.table-toolbar {
  margin-bottom: 20px;
  display: flex;
  justify-content: flex-start;
  gap: 10px;
}

.table-card {
  margin-bottom: 20px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
