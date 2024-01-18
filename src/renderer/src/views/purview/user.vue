<template>
  <div class="container">
    <div class="bread-crumb">员工管理</div>
    <div class="container-main">
      <el-card>
        <JCSearchForm :model="form">
          <JCSearchLine @search="onSearch">
            <JCInput
              v-model="form.userName"
              prop="userName"
              label="姓名"
              placeholder="请输入员工姓名"
              clearable
            />
            <JCCascader
              v-model="form.deptId"
              :options="deptGroup"
              prop="deptId"
              label="部门"
              clearable
              :props="{ value: 'deptId', label: 'deptName', checkStrictly: true }"
            />
            <JCCascader
              v-model="form.roleId"
              :options="rolesGroup"
              prop="roleId"
              label="角色"
              clearable
              :props="{ value: 'id', label: 'name', children: 'details' }"
            />
            <JCSelect v-model="form.status" prop="status" label="状态" clearable>
              <el-option
                v-for="(i, index) in USER_STATUS"
                :key="index"
                :label="i.label"
                :value="i.value"
              />
            </JCSelect>
          </JCSearchLine>
        </JCSearchForm>
      </el-card>
      <el-card class="mt20 flex-1 flex-column">
        <div class="mb16 justify-content-end">
          <el-button :disabled="multipleSelection.length == 0" @click="deleteGroup">删除</el-button>
          <el-button type="primary" @click="handleEditOrAdd()">新增</el-button>
        </div>
        <el-table :data="queryData" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" />
          <el-table-column prop="nickName" label="员工姓名" />
          <el-table-column prop="userName" label="账号" />
          <el-table-column prop="phoneNumber" label="手机号码" />
          <el-table-column prop="roleName" label="角色" show-overflow-tooltip />
          <el-table-column prop="deptName" label="部门" />
          <el-table-column prop="status" label="状态">
            <template #default="{ row }">
              <el-tag :type="row.status == 0 ? 'success' : 'warning'">{{
                row.status == 0 ? '启用' : '禁用'
              }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="entryTime" label="入职时间">
            <template #default="props">
              <span>{{ props.row.entryTime?.split(' ')[0] }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="{ row }">
              <el-popover trigger="click" :show-arrow="false">
                <template #reference>
                  <el-button type="primary" link>更多</el-button>
                </template>
                <el-button type="primary" text @click="reset(row)">重置密码</el-button>
                <el-button type="primary" text v-if="row.status == 0" @click="stop(row)">
                  禁用
                </el-button>
                <el-button type="primary" text v-else @click="enable(row)">启用</el-button>
                <el-button type="primary" text @click="handleEditOrAdd(row)">编辑</el-button>
                <el-button type="danger" text @click="deleteInfo(row)">删除</el-button>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
        <JCPagination
          v-model:page-num="pageNum"
          v-model:page-size="pageSize"
          :total="total"
          @query="query"
        />
      </el-card>
      <UserDrawer
        title="add & edit"
        ref="userDrawer"
        v-model:visible="handleStatus"
        @submit="onSubmit"
      />
    </div>
  </div>
</template>
<route> { meta: { title: "员工管理", menuIndex: '1-1' } } </route>

<script setup name="BasicUser" lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { UserApi, RoleApi, DeptApi } from '@renderer/api'
import { useCRUD } from '@renderer/utils/crud'
import type { UserListsParam, UserData } from '@renderer/types/user'
import { paginationConfig } from '@renderer/config'
import type { PartialBy } from '@renderer/types/optional'
import { USER_STATUS } from '@renderer/consts/index'
import UserDrawer from './components/user-drawer.vue'
import { message } from '@renderer/utils/message'
import { ElMessage } from 'element-plus'
import type { DeptListData } from '@renderer/types/dept'
import type { authTreeType } from '@renderer/types/role'

const form = reactive<UserListsParam>({
  userName: '',
  deptId: '',
  roleId: '',
  status: ''
})

let rolesGroup = ref<authTreeType[]>()
let deptGroup = ref<DeptListData[]>()

onMounted(() => {
  query()
  DeptApi.fetchList<undefined, DeptListData>().then(res => {
    deptGroup.value = res.data
  })
  RoleApi.fetchList<undefined, authTreeType>().then(res => {
    rolesGroup.value = res.data
  })
})

const pageNum = ref(1)
const pageSize = ref(paginationConfig.pageSize)

const userDrawer = ref()

const { query, queryData, total, handleEditOrAdd, handleStatus, add, edit, remove } =
  useCRUD<UserListsParam>(
    UserApi,
    Object.assign(form, {
      pageSize,
      pageNum
    }),
    userDrawer
  )

const onSearch = () => {
  pageNum.value = 1
  query()
}

const onSubmit = (data: PartialBy<UserData, 'userId'>) => {
  data.userId ? edit(data) : add(data)
}

const reset = (row: UserData) => {
  message(
    `是否为 ${row.userName} 的账号重置密码`,
    () => {
      UserApi.resetPwd({ userId: row.userId, password: '123456' }).then(() => {
        query()
      })
    },
    '重置密码',
    '确定',
    '默认秘密：123456'
  )
}
const stop = (row: UserData) => {
  message(
    `员工 ${row.userName} 的账号禁用后不能正常登录，是否禁用？`,
    () => {
      UserApi.changeStatus({ userId: row.userId, status: '1' }).then(() => {
        query()
      })
    },
    '删除确认',
    '禁用'
  )
}
const enable = (row: UserData) => {
  UserApi.changeStatus({ userId: row.userId, status: '0' }).then(() => {
    ElMessage.success(`${row.userName}的账号启用成功`)
    query()
  })
}
const deleteInfo = (row: UserData) => {
  remove(`员工 ${row.userName} 的账号删除后不能正常使用，是否删除？`, [row.userId])
}
const multipleSelection = ref<UserData[]>([])
const handleSelectionChange = (val: UserData[]) => {
  multipleSelection.value = val
}
const deleteGroup = () => {
  const arr = multipleSelection.value.map(m => {
    return m.userId
  })
  remove('选中账号删除后将不能正常使用，是否删除？', arr)
}
</script>
<style lang="scss" scoped>
.reset-title {
  font-size: 16px;
  color: #666;
  margin: 10px 0;
}
.reset-text {
  color: #9c9c9c;
}
</style>
