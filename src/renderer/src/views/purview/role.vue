<template>
  <div class="container">
    <div class="bread-crumb">角色权限</div>
    <el-row class="container-main role-main">
      <el-col :span="6" class="tree-container full-height">
        <el-scrollbar>
          <el-tree
            :data="roleList"
            node-key="id"
            default-expand-all
            :props="{ children: 'details' }"
            @node-click="treeClick"
            :expand-on-click-node="false"
            class="role-tree"
          >
            <template #default="{ node, data }">
              <span class="role-tree-node">
                <div class="role-tree-label">
                  <SvgIcon name="folder" v-if="node.level === 1" />
                  <SvgIcon name="administrator" v-else />
                  <span>{{ data.name }}</span>
                </div>
                <div>
                  <SvgIcon
                    name="add"
                    v-if="data.details"
                    @click="handleEditOrAdd({ systemId: data.id })"
                    class="tree-handle"
                  />
                  <el-dropdown
                    trigger="click"
                    @command="handleCommand($event, data)"
                    v-else
                    class="tree-handle"
                  >
                    <SvgIcon name="more" />
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item command="edit">编辑角色</el-dropdown-item>
                        <el-dropdown-item command="remove">删除角色</el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </div>
              </span>
            </template>
          </el-tree>
        </el-scrollbar>
      </el-col>
      <el-col :span="18" class="table-container flex-column">
        <div class="table-header space-between">
          <span class="table-header-name">{{ roleData.roleName }}</span>
          <el-button v-if="roleData.roleId" @click="handleEditOrAdd(roleData)" type="primary" link>
            编辑角色
          </el-button>
        </div>
        <div class="user-table flex-1">
          <el-table :data="tableData" :header-cell-style="{ background: '#F5F7FA' }">
            <el-table-column prop="nickName" label="员工姓名" />
            <el-table-column prop="userName" label="账号" />
            <el-table-column prop="roleName" label="角色" />
            <el-table-column prop="systemName" label="系统" />
            <el-table-column prop="phoneNumber" label="手机号码" width="160" />
            <el-table-column prop="status" label="状态">
              <template #default="{ row }">
                <el-tag :type="row.status == 0 ? 'success' : 'warning'">
                  {{ row.status == 0 ? '启用' : '停用' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="deptName" label="部门" />
          </el-table>
        </div>
        <JCPagination
          class="table-pagination"
          v-model:page-num="pageNum"
          v-model:page-size="pageSize"
          :total="total"
          @query="getTableList"
        />
      </el-col>
    </el-row>
    <RoleDrawer v-model:visible="handleStatus" title="角色" ref="roleDrawerRef" @submit="submit" />
  </div>
</template>
<route> { meta: { title: "角色权限", menuIndex: '1-2' } } </route>

<script setup name="BasicRole" lang="ts">
import { useCRUD } from '@renderer/utils/crud'
import { RoleApi } from '@renderer/api'
import type { RoleForm, RoleTreeType } from '@renderer/types/role'
import { ref, reactive, onMounted } from 'vue'
import { paginationConfig } from '@renderer/config'
import RoleDrawer from './components/role-drawer.vue'

const pageNum = ref(1)
const pageSize = ref(paginationConfig.pageSize)
const total = ref(0)
const roleDrawerRef = ref()
const roleData = reactive<Partial<RoleForm>>({
  roleName: '',
  roleId: undefined,
  systemId: 0
})
const tableData = ref()

const {
  query,
  queryData: roleList,
  remove,
  add,
  edit,
  handleEditOrAdd,
  handleStatus
} = useCRUD<RoleForm>(RoleApi, undefined, roleDrawerRef)

const submit = (data: any) => {
  if (data.roleId) {
    edit(data, () => {
      roleData.roleName = data.roleName
      getTableList()
    })
  } else {
    add(data)
  }
}

// 点击下拉
const handleCommand = (command: string, data: RoleTreeType) => {
  switch (command) {
    case 'edit':
      handleEditOrAdd(roleData)
      break
    case 'remove':
      remove(`角色 ${data.name} 删除后不能恢复，是否删除？`, [data.id], () => initRoleData())
      break
    default:
      break
  }
}

// 点击树
const treeClick = (node: any, treeNode: any) => {
  if (treeNode.level === 2) {
    if (roleData.roleId === node.id) {
      return
    }
    pageNum.value = 1
    roleData.roleId = node.id
    roleData.roleName = node.name
    roleData.systemId = treeNode.parent.data.id
    getTableList()
  }
}

// 获取用户列表
const getTableList = () => {
  RoleApi.fetchRoleList(roleData.roleId, {
    pageNum: pageNum.value,
    pageSize: pageSize.value
  }).then(res => {
    tableData.value = res.data
    total.value = res.total || 0
  })
}

const initRoleData = () => {
  pageNum.value = 1
  query<undefined, RoleTreeType[]>(() => {
    roleData.systemId = roleList.value[0].id
    if (roleList.value[0].details && roleList.value[0].details.length !== 0) {
      roleData.roleId = roleList.value[0].details[0].id
      roleData.roleName = roleList.value[0].details[0].name
      getTableList()
    } else {
      roleData.roleId = undefined
      roleData.roleName = ''
      tableData.value = []
      total.value = 0
    }
  })
}

onMounted(() => {
  initRoleData()
})
</script>

<style scoped lang="scss">
.role-main {
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
      &-name {
        font-size: 20px;
        color: #333;
      }
    }
    .user-table {
      padding: 0 16px;
      overflow: hidden;
    }
    .table-pagination {
      padding-right: 16px;
    }
  }
}

.role-tree {
  --el-tree-node-content-height: 38px;
  &-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 8px;
  }
  &-label {
    display: flex;
    align-items: center;
    span {
      padding-left: 4px;
    }
  }
  .tree-handle {
    display: none;
  }
  .el-tree-node__content:hover,
  .el-tree-node__children .el-tree-node.is-current,
  .el-tree-node.is-current > .el-tree-node__content {
    .tree-handle {
      display: inline-flex;
    }
  }
}
</style>
