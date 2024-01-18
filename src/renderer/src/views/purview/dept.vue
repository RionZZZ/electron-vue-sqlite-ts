<template>
  <div class="container">
    <div class="bread-crumb">组织架构</div>
    <el-row class="container-main dept-main">
      <el-col :span="6" class="tree-container full-height">
        <DeptTree
          :table-data="queryData"
          @node-click="queryUserList"
          @handle-edit-or-add="handleEditOrAdd"
          @handle-delete="handleDelete"
        />
      </el-col>
      <el-col :span="18" class="table-container flex-column">
        <div class="table-header space-between">
          <span class="dept-name">{{ dept.deptName }}</span>
          <el-button
            v-if="dept.deptId === 0"
            link
            type="primary"
            @click="handleEditOrAdd(dept, HandleType.add)"
          >
            添加部门
          </el-button>
          <div v-else>
            <el-button link type="primary" @click="handleEditOrAdd(dept, HandleType.edit)">
              编辑部门
            </el-button>
            <el-divider direction="vertical" />
            <el-button link type="primary" @click="handleEditOrAdd(dept, HandleType.add)">
              添加下级部门
            </el-button>
          </div>
        </div>
        <DeptUserTable :table-data="userList" class="user-table flex-1" />
        <JCPagination
          v-model:page-num="pageNum"
          v-model:page-size="pageSize"
          :total="total"
          @query="fetchUserList"
          class="user-pagination"
        />
      </el-col>
    </el-row>
    <DeptDrawer ref="deptDrawer" v-model:visible="handleStatus" @submit="onSubmit" />
  </div>
</template>
<route> { meta: { title: "组织架构", menuIndex: '1-3' } } </route>

<script setup name="BasicDept" lang="ts">
import { DeptApi } from '@renderer/api'
import { paginationConfig } from '@renderer/config'
import type { DeptListData } from '@renderer/types/dept'
import type { UserData } from '@renderer/types/user'
import { HandleType } from '@renderer/types'
import { useCRUD } from '@renderer/utils/crud'
import { onMounted, ref } from 'vue'
import DeptTree from './components/dept-tree.vue'
import DeptUserTable from './components/dept-user-table.vue'
import DeptDrawer from './components/dept-drawer.vue'

const deptDrawer = ref()
const { query, queryData, handleStatus, handleEditOrAdd, add, edit, remove } = useCRUD(
  DeptApi,
  undefined,
  deptDrawer
)
const dept = ref<Partial<DeptListData>>({})

onMounted(() => {
  fetchInit()
})
const fetchInit = () => {
  query<undefined, DeptListData>(() => {
    dept.value = queryData.value[0] as DeptListData
    queryUserList()
  })
}

const pageNum = ref(1)
const pageSize = ref(paginationConfig.pageSize)
const userList = ref<UserData[]>()
const total = ref(0)

const queryUserList = (deptData?: DeptListData) => {
  if (deptData) {
    if (dept.value.deptId === deptData.deptId) {
      return
    }
    dept.value = deptData
  }

  pageNum.value = 1
  fetchUserList()
}
const fetchUserList = () => {
  DeptApi.fetchUserList({
    deptId: dept.value.deptId,
    pageNum: pageNum.value,
    pageSize: pageSize.value
  }).then(res => {
    userList.value = res.data
    total.value = res.total!
  })
}

const handleDelete = (deptData: DeptListData) => {
  remove(`部门 ${deptData.deptName} 删除后不可恢复，是否删除？`, [deptData.deptId], fetchInit)
}

const onSubmit = (data: DeptListData & { handleType: HandleType }) => {
  if (data.handleType === HandleType.add) {
    add({ parentId: data.parentId, deptName: data.deptName })
  } else {
    edit({ deptId: data.deptId, deptName: data.deptName }, () => {
      dept.value.deptName = data.deptName
    })
  }
}
</script>
<style lang="scss" scoped>
.dept-main {
  flex-direction: row;
  background-color: #fff;
  .tree-container {
    padding: 10px 10px 0;
  }
  .table-container {
    height: 100%;
    border-left: 1px solid #ededed;
    .table-header {
      height: 80px;
      padding-left: 24px;
      padding-right: 16px;
      .dept-name {
        font-size: 20px;
        color: #333;
      }
    }
    .user-table {
      padding: 0 16px;
      overflow: hidden;
    }
    .user-pagination {
      padding-right: 16px;
    }
  }
}
</style>
