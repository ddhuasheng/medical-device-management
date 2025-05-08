<template>
  <div class="supplier-equipment-container">
    <!-- 搜索区域 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="设备名称">
          <el-input
            v-model="searchForm.equipmentName"
            placeholder="请输入设备名称"
            clearable
          />
        </el-form-item>
        <el-form-item label="供应商">
          <el-select
            v-model="searchForm.supplierId"
            placeholder="请选择供应商"
            clearable
            filterable
          >
            <el-option
              v-for="item in supplierOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="设备分类">
          <el-select
            v-model="searchForm.categoryId"
            placeholder="请选择设备分类"
            clearable
            filterable
          >
            <el-option
              v-for="item in categoryOptions"
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
        <el-icon><Plus /></el-icon>新增设备
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
        <el-table-column prop="equipmentCode" label="设备编码" width="120" />
        <el-table-column prop="equipmentName" label="设备名称" width="150" />
        <el-table-column prop="supplierName" label="供应商" width="180" />
        <el-table-column prop="categoryName" label="设备分类" width="120" />
        <el-table-column prop="model" label="设备型号" width="120" />
        <el-table-column prop="specification" label="规格" width="120" />
        <el-table-column prop="price" label="单价" width="120">
          <template #default="scope">
            {{ formatCurrency(scope.row.price) }}
          </template>
        </el-table-column>
        <el-table-column prop="warrantyPeriod" label="质保期(月)" width="100" />
        <el-table-column prop="manufacturer" label="生产厂商" width="180" />
        <el-table-column prop="productionDate" label="生产日期" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusLabel(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
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
      :title="dialogType === 'add' ? '新增设备' : '编辑设备'"
      v-model="dialogVisible"
      width="700px"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="设备编码" prop="equipmentCode">
              <el-input
                v-model="form.equipmentCode"
                placeholder="请输入设备编码"
                :disabled="dialogType === 'edit'"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备名称" prop="equipmentName">
              <el-input
                v-model="form.equipmentName"
                placeholder="请输入设备名称"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="供应商" prop="supplierId">
              <el-select
                v-model="form.supplierId"
                placeholder="请选择供应商"
                filterable
              >
                <el-option
                  v-for="item in supplierOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备分类" prop="categoryId">
              <el-select
                v-model="form.categoryId"
                placeholder="请选择设备分类"
                filterable
              >
                <el-option
                  v-for="item in categoryOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="设备型号" prop="model">
              <el-input v-model="form.model" placeholder="请输入设备型号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="规格" prop="specification">
              <el-input v-model="form.specification" placeholder="请输入规格" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="单价" prop="price">
              <el-input-number
                v-model="form.price"
                :min="0"
                :precision="2"
                :step="100"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="质保期(月)" prop="warrantyPeriod">
              <el-input-number
                v-model="form.warrantyPeriod"
                :min="0"
                :precision="0"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="生产厂商" prop="manufacturer">
              <el-input
                v-model="form.manufacturer"
                placeholder="请输入生产厂商"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="生产日期" prop="productionDate">
              <el-date-picker
                v-model="form.productionDate"
                type="date"
                placeholder="选择生产日期"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
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
        <el-form-item label="设备说明书" prop="manual">
          <el-upload
            class="upload-demo"
            action="#"
            :auto-upload="false"
            :on-change="handleManualChange"
            :limit="1"
          >
            <template #trigger>
              <el-button type="primary">选择文件</el-button>
            </template>
            <template #tip>
              <div class="el-upload__tip">请上传设备说明书，支持PDF格式</div>
            </template>
          </el-upload>
        </el-form-item>
        <el-form-item label="设备图片" prop="image">
          <el-upload
            class="upload-demo"
            action="#"
            :auto-upload="false"
            :on-change="handleImageChange"
            :limit="5"
            list-type="picture-card"
          >
            <el-icon><Plus /></el-icon>
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
    <el-dialog title="设备详情" v-model="viewDialogVisible" width="700px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="设备编码">{{
          viewForm.equipmentCode
        }}</el-descriptions-item>
        <el-descriptions-item label="设备名称">{{
          viewForm.equipmentName
        }}</el-descriptions-item>
        <el-descriptions-item label="供应商">{{
          viewForm.supplierName
        }}</el-descriptions-item>
        <el-descriptions-item label="设备分类">{{
          viewForm.categoryName
        }}</el-descriptions-item>
        <el-descriptions-item label="设备型号">{{
          viewForm.model
        }}</el-descriptions-item>
        <el-descriptions-item label="规格">{{
          viewForm.specification
        }}</el-descriptions-item>
        <el-descriptions-item label="单价">{{
          formatCurrency(viewForm.price)
        }}</el-descriptions-item>
        <el-descriptions-item label="质保期(月)">{{
          viewForm.warrantyPeriod
        }}</el-descriptions-item>
        <el-descriptions-item label="生产厂商">{{
          viewForm.manufacturer
        }}</el-descriptions-item>
        <el-descriptions-item label="生产日期">{{
          viewForm.productionDate
        }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusType(viewForm.status)">
            {{ getStatusLabel(viewForm.status) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">{{
          viewForm.createTime
        }}</el-descriptions-item>
        <el-descriptions-item label="设备说明书" :span="2">
          <el-button
            type="primary"
            link
            @click="viewManual(viewForm)"
            v-if="viewForm.manual"
          >
            查看
          </el-button>
          <span v-else>未上传</span>
        </el-descriptions-item>
        <el-descriptions-item label="设备图片" :span="2">
          <div
            class="image-preview"
            v-if="viewForm.images && viewForm.images.length"
          >
            <el-image
              v-for="(url, index) in viewForm.images"
              :key="index"
              :src="url"
              :preview-src-list="viewForm.images"
              fit="cover"
              class="preview-image"
            />
          </div>
          <span v-else>未上传</span>
        </el-descriptions-item>
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
  { value: 'active', label: '在售' },
  { value: 'discontinued', label: '停产' },
  { value: 'upcoming', label: '即将上市' },
]

// 获取状态标签类型
const getStatusType = (status) => {
  switch (status) {
    case 'active':
      return 'success'
    case 'discontinued':
      return 'info'
    case 'upcoming':
      return 'warning'
    default:
      return 'info'
  }
}

// 获取状态标签文本
const getStatusLabel = (status) => {
  const found = statusOptions.find((item) => item.value === status)
  return found ? found.label : status
}

// 格式化货币
const formatCurrency = (value) => {
  return `¥ ${Number(value).toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

// 搜索表单
const searchForm = reactive({
  equipmentName: '',
  supplierId: '',
  categoryId: '',
})

// 重置搜索
const resetSearch = () => {
  searchForm.equipmentName = ''
  searchForm.supplierId = ''
  searchForm.categoryId = ''
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
        equipmentCode: 'SB20230001',
        equipmentName: 'CT扫描仪',
        supplierId: 1,
        supplierName: '北京医疗设备有限公司',
        categoryId: 1,
        categoryName: '影像设备',
        model: 'CT-X100',
        specification: '16排螺旋CT',
        price: 1500000,
        warrantyPeriod: 36,
        manufacturer: '西门子医疗器械（上海）有限公司',
        productionDate: '2023-05-15',
        status: 'active',
        manual: 'manual1.pdf',
        images: ['image1.jpg', 'image2.jpg'],
        createTime: '2023-06-15 10:30:00',
        remark: '高端CT设备，适用于各类医院放射科',
      },
      {
        id: 2,
        equipmentCode: 'SB20230002',
        equipmentName: '呼吸机',
        supplierId: 2,
        supplierName: '上海医疗器械有限公司',
        categoryId: 2,
        categoryName: '生命支持设备',
        model: 'HX-2000',
        specification: '高频呼吸机',
        price: 120000,
        warrantyPeriod: 24,
        manufacturer: '飞利浦医疗系统有限公司',
        productionDate: '2023-04-20',
        status: 'active',
        manual: 'manual2.pdf',
        images: ['image3.jpg'],
        createTime: '2023-06-20 14:20:00',
        remark: '适用于ICU重症患者',
      },
      {
        id: 3,
        equipmentCode: 'SB20230003',
        equipmentName: 'MRI设备',
        supplierId: 1,
        supplierName: '北京医疗设备有限公司',
        categoryId: 1,
        categoryName: '影像设备',
        model: 'MRI-3000',
        specification: '3.0T超导型',
        price: 3000000,
        warrantyPeriod: 48,
        manufacturer: 'GE医疗系统贸易（上海）有限公司',
        productionDate: '2023-03-10',
        status: 'upcoming',
        manual: 'manual3.pdf',
        images: ['image4.jpg', 'image5.jpg', 'image6.jpg'],
        createTime: '2023-07-05 09:15:00',
        remark: '高端磁共振成像设备',
      },
      {
        id: 4,
        equipmentCode: 'SB20230004',
        equipmentName: '心电图机',
        supplierId: 3,
        supplierName: '广州医疗科技有限公司',
        categoryId: 3,
        categoryName: '诊断设备',
        model: 'ECG-300',
        specification: '12导联',
        price: 50000,
        warrantyPeriod: 24,
        manufacturer: '深圳迈瑞生物医疗电子股份有限公司',
        productionDate: '2023-02-25',
        status: 'discontinued',
        manual: 'manual4.pdf',
        images: ['image7.jpg'],
        createTime: '2023-07-10 16:45:00',
        remark: '常规心电图检查设备',
      },
    ]

    // 过滤数据
    let filteredData = [...mockData]
    if (searchForm.equipmentName) {
      filteredData = filteredData.filter((item) =>
        item.equipmentName.includes(searchForm.equipmentName)
      )
    }
    if (searchForm.supplierId) {
      filteredData = filteredData.filter(
        (item) => item.supplierId === parseInt(searchForm.supplierId)
      )
    }
    if (searchForm.categoryId) {
      filteredData = filteredData.filter(
        (item) => item.categoryId === parseInt(searchForm.categoryId)
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

// 供应商选项
const supplierOptions = ref([
  { value: 1, label: '北京医疗设备有限公司' },
  { value: 2, label: '上海医疗器械有限公司' },
  { value: 3, label: '广州医疗科技有限公司' },
])

// 设备分类选项
const categoryOptions = ref([
  { value: 1, label: '影像设备' },
  { value: 2, label: '生命支持设备' },
  { value: 3, label: '诊断设备' },
  { value: 4, label: '治疗设备' },
  { value: 5, label: '监护设备' },
  { value: 6, label: '手术设备' },
])

// 对话框相关
const dialogVisible = ref(false)
const dialogType = ref('add')
const formRef = ref(null)
const viewDialogVisible = ref(false)

// 表单数据
const form = reactive({
  id: null,
  equipmentCode: '',
  equipmentName: '',
  supplierId: '',
  categoryId: '',
  model: '',
  specification: '',
  price: 0,
  warrantyPeriod: 12,
  manufacturer: '',
  productionDate: '',
  status: 'active',
  manual: null,
  images: [],
  remark: '',
})

// 查看表单数据
const viewForm = reactive({
  id: null,
  equipmentCode: '',
  equipmentName: '',
  supplierId: '',
  supplierName: '',
  categoryId: '',
  categoryName: '',
  model: '',
  specification: '',
  price: 0,
  warrantyPeriod: 0,
  manufacturer: '',
  productionDate: '',
  status: '',
  manual: null,
  images: [],
  createTime: '',
  remark: '',
})

// 表单验证规则
const rules = {
  equipmentCode: [
    { required: true, message: '请输入设备编码', trigger: 'blur' },
  ],
  equipmentName: [
    { required: true, message: '请输入设备名称', trigger: 'blur' },
  ],
  supplierId: [{ required: true, message: '请选择供应商', trigger: 'change' }],
  categoryId: [
    { required: true, message: '请选择设备分类', trigger: 'change' },
  ],
  model: [{ required: true, message: '请输入设备型号', trigger: 'blur' }],
  price: [{ required: true, message: '请输入单价', trigger: 'blur' }],
  manufacturer: [
    { required: true, message: '请输入生产厂商', trigger: 'blur' },
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
  form.equipmentCode = ''
  form.equipmentName = ''
  form.supplierId = ''
  form.categoryId = ''
  form.model = ''
  form.specification = ''
  form.price = 0
  form.warrantyPeriod = 12
  form.manufacturer = ''
  form.productionDate = ''
  form.status = 'active'
  form.manual = null
  form.images = []
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
  ElMessageBox.confirm('确定要删除该设备吗？', '提示', {
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
    ElMessage.warning('请选择要删除的设备')
    return
  }
  ElMessageBox.confirm(
    `确定要删除选中的 ${selectedRows.value.length} 个设备吗？`,
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

// 处理说明书文件变更
const handleManualChange = (file) => {
  form.manual = file.raw
}

// 处理图片变更
const handleImageChange = (file) => {
  form.images.push(file.raw)
}

// 查看说明书
const viewManual = (row) => {
  // 这里应该是调用API获取文件并预览
  ElMessage.info('查看说明书：' + row.manual)
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.supplier-equipment-container {
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

.image-preview {
  display: flex;
  flex-wrap: wrap;
}
</style>
