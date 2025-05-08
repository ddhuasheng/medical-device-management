<template>
  <div class="equipment-category-container">
    <!-- 搜索区域 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="分类名称">
          <el-input
            v-model="searchForm.categoryName"
            placeholder="请输入分类名称"
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
        <el-icon><Plus /></el-icon>新增分类
      </el-button>
      <el-button
        type="danger"
        :disabled="!selectedRows.length"
        @click="handleBatchDelete"
      >
        <el-icon><Delete /></el-icon>批量删除
      </el-button>
    </div>

    <!-- 表格区域 -->
    <el-card class="table-card">
      <el-table
        v-loading="loading"
        :data="tableData"
        border
        row-key="id"
        default-expand-all
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="categoryCode" label="分类编码" width="120" />
        <el-table-column prop="categoryName" label="分类名称" width="180" />
        <el-table-column
          prop="description"
          label="描述"
          show-overflow-tooltip
        />
        <el-table-column prop="sort" label="排序" width="80" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'active' ? 'success' : 'info'">
              {{ scope.row.status === 'active' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="150" />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button
              type="primary"
              link
              @click="handleAdd(scope.row)"
              v-if="scope.row.status === 'active'"
            >
              添加子分类
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
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      :title="
        dialogType === 'add'
          ? parentCategory
            ? '新增子分类'
            : '新增分类'
          : '编辑分类'
      "
      v-model="dialogVisible"
      width="500px"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="上级分类">
          <el-cascader
            v-model="form.parentId"
            :options="categoryOptions"
            :props="{
              checkStrictly: true,
              label: 'categoryName',
              value: 'id',
              emitPath: false,
            }"
            clearable
            placeholder="请选择上级分类"
            :disabled="!!parentCategory"
          />
        </el-form-item>
        <el-form-item label="分类编码" prop="categoryCode">
          <el-input
            v-model="form.categoryCode"
            placeholder="请输入分类编码"
            :disabled="dialogType === 'edit'"
          />
        </el-form-item>
        <el-form-item label="分类名称" prop="categoryName">
          <el-input v-model="form.categoryName" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            placeholder="请输入描述"
            :rows="3"
          />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number
            v-model="form.sort"
            :min="0"
            :max="999"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio label="active">启用</el-radio>
            <el-radio label="inactive">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Delete } from '@element-plus/icons-vue'

// 状态选项
const statusOptions = [
  { value: 'active', label: '启用' },
  { value: 'inactive', label: '禁用' },
]

// 搜索表单
const searchForm = reactive({
  categoryName: '',
  status: '',
})

// 重置搜索
const resetSearch = () => {
  searchForm.categoryName = ''
  searchForm.status = ''
  handleSearch()
}

// 处理搜索
const handleSearch = () => {
  fetchData()
}

// 表格数据
const loading = ref(false)
const tableData = ref([])
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
        categoryCode: 'FL001',
        categoryName: '影像设备',
        description: '包括CT、MRI等影像类医疗设备',
        sort: 1,
        status: 'active',
        createTime: '2023-06-15 10:30:00',
        children: [
          {
            id: 4,
            parentId: 1,
            categoryCode: 'FL001001',
            categoryName: 'CT设备',
            description: 'CT扫描仪等设备',
            sort: 1,
            status: 'active',
            createTime: '2023-06-15 11:30:00',
          },
          {
            id: 5,
            parentId: 1,
            categoryCode: 'FL001002',
            categoryName: 'MRI设备',
            description: '磁共振成像设备',
            sort: 2,
            status: 'active',
            createTime: '2023-06-15 11:35:00',
          },
        ],
      },
      {
        id: 2,
        categoryCode: 'FL002',
        categoryName: '生命支持设备',
        description: '包括呼吸机、监护仪等生命支持类医疗设备',
        sort: 2,
        status: 'active',
        createTime: '2023-06-20 14:20:00',
        children: [
          {
            id: 6,
            parentId: 2,
            categoryCode: 'FL002001',
            categoryName: '呼吸机',
            description: '各类呼吸机设备',
            sort: 1,
            status: 'active',
            createTime: '2023-06-20 15:20:00',
          },
          {
            id: 7,
            parentId: 2,
            categoryCode: 'FL002002',
            categoryName: '监护仪',
            description: '各类监护仪设备',
            sort: 2,
            status: 'active',
            createTime: '2023-06-20 15:25:00',
          },
        ],
      },
      {
        id: 3,
        categoryCode: 'FL003',
        categoryName: '诊断设备',
        description: '包括心电图机、超声波仪等诊断类医疗设备',
        sort: 3,
        status: 'inactive',
        createTime: '2023-07-05 09:15:00',
        children: [
          {
            id: 8,
            parentId: 3,
            categoryCode: 'FL003001',
            categoryName: '心电图机',
            description: '各类心电图检查设备',
            sort: 1,
            status: 'inactive',
            createTime: '2023-07-05 10:15:00',
          },
          {
            id: 9,
            parentId: 3,
            categoryCode: 'FL003002',
            categoryName: '超声波仪',
            description: '各类超声波检查设备',
            sort: 2,
            status: 'inactive',
            createTime: '2023-07-05 10:20:00',
          },
        ],
      },
    ]

    // 过滤数据
    let filteredData = [...mockData]
    if (searchForm.categoryName) {
      // 递归过滤函数
      const filterTree = (data) => {
        return data.filter((item) => {
          const match = item.categoryName.includes(searchForm.categoryName)
          if (item.children && item.children.length) {
            const filteredChildren = filterTree(item.children)
            item.children = filteredChildren
            return match || filteredChildren.length > 0
          }
          return match
        })
      }
      filteredData = filterTree(filteredData)
    }
    if (searchForm.status) {
      // 递归过滤函数
      const filterTree = (data) => {
        return data.filter((item) => {
          const match = item.status === searchForm.status
          if (item.children && item.children.length) {
            const filteredChildren = filterTree(item.children)
            item.children = filteredChildren
            return match || filteredChildren.length > 0
          }
          return match
        })
      }
      filteredData = filterTree(filteredData)
    }

    tableData.value = filteredData
    loading.value = false
  }, 500)
}

// 处理表格选择变化
const handleSelectionChange = (rows) => {
  selectedRows.value = rows
}

// 对话框相关
const dialogVisible = ref(false)
const dialogType = ref('add')
const formRef = ref(null)
const parentCategory = ref(null)

// 表单数据
const form = reactive({
  id: null,
  parentId: null,
  categoryCode: '',
  categoryName: '',
  description: '',
  sort: 0,
  status: 'active',
})

// 表单验证规则
const rules = {
  categoryCode: [
    { required: true, message: '请输入分类编码', trigger: 'blur' },
  ],
  categoryName: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
  ],
  sort: [{ required: true, message: '请输入排序', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
}

// 分类选项（用于级联选择器）
const categoryOptions = computed(() => {
  // 递归构建分类树
  const buildTree = (data) => {
    return data.map((item) => {
      const node = {
        id: item.id,
        categoryName: item.categoryName,
        categoryCode: item.categoryCode,
      }
      if (item.children && item.children.length) {
        node.children = buildTree(item.children)
      }
      return node
    })
  }
  return buildTree(tableData.value)
})

// 处理新增
const handleAdd = (row) => {
  dialogType.value = 'add'
  resetForm()
  if (row) {
    // 添加子分类
    parentCategory.value = row
    form.parentId = row.id
  } else {
    // 添加顶级分类
    parentCategory.value = null
    form.parentId = null
  }
  dialogVisible.value = true
}

// 处理编辑
const handleEdit = (row) => {
  dialogType.value = 'edit'
  resetForm()
  Object.assign(form, row)
  parentCategory.value = null
  dialogVisible.value = true
}

// 重置表单
const resetForm = () => {
  form.id = null
  form.parentId = null
  form.categoryCode = ''
  form.categoryName = ''
  form.description = ''
  form.sort = 0
  form.status = 'active'
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
  if (row.children && row.children.length) {
    ElMessage.warning('该分类下有子分类，不能删除')
    return
  }
  ElMessageBox.confirm('确定要删除该分类吗？', '提示', {
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
    ElMessage.warning('请选择要删除的分类')
    return
  }
  // 检查是否有子分类
  const hasChildren = selectedRows.value.some(
    (row) => row.children && row.children.length
  )
  if (hasChildren) {
    ElMessage.warning('选中的分类中有包含子分类的项，不能删除')
    return
  }
  ElMessageBox.confirm(
    `确定要删除选中的 ${selectedRows.value.length} 个分类吗？`,
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

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.equipment-category-container {
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
</style>
