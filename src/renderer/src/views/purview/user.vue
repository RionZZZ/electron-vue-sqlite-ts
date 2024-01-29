<template>
  <div class="container">
    <div class="bread-crumb">用户管理</div>
    <div class="container-main">
      <el-card>
        <JCSearchForm :model="form">
          <JCSearchLine @search="queryAll">
            <JCInput
              v-model="form.userName"
              prop="userName"
              label="姓名"
              placeholder="请输入姓名"
              clearable
            />
            <JCSelect v-model="form.status" prop="status" label="状态" clearable>
              <el-option
                v-for="status in USER_STATUS"
                :key="status.key"
                :label="status.value"
                :value="status.key"
              />
            </JCSelect>
          </JCSearchLine>
        </JCSearchForm>
      </el-card>
      <el-card class="mt20 flex-1 flex-column">
        <div class="mb16 justify-content-end">
          <el-button type="primary" @click="handleEditOrAdd(HandleType.add)">新增</el-button>
        </div>
        <el-table :data="userList">
          <el-table-column prop="userName" label="姓名" />
          <el-table-column prop="phone" label="手机号码" />
          <el-table-column prop="email" label="邮箱" />
          <el-table-column prop="role" label="角色" />
          <el-table-column prop="remark" label="备注" />
          <el-table-column label="操作" align="center">
            <template #default="{ row }">
              <el-popover trigger="click" :show-arrow="false" popper-class="popper">
                <template #reference>
                  <el-button type="primary" link>更多</el-button>
                </template>
                <el-button type="primary" text @click="handleEditOrAdd(HandleType.edit, row)"
                  >编辑</el-button
                >
                <el-button type="primary" text @click="resetPassword(row)">重置密码</el-button>
                <el-button type="primary" text @click="updateStatus(row)">{{
                  row.status === '0' ? '启用' : '禁用'
                }}</el-button>
                <el-button type="primary" text @click="handleDelete(row)">删除</el-button>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <UserDialog ref="userDialogRef" v-model:visible="handleStatus" @submit="onSubmit" />
    </div>
  </div>
</template>
<route> { meta: { title: "用户管理", menuIndex: '1-1' } } </route>

<script setup name="BasicUser" lang="ts">
import { inject, onMounted, reactive, ref, toRaw } from 'vue'
import { Vegetable } from '@renderer/modules/provide'
import { message } from '@renderer/utils/message'
import { HandleType } from '@renderer/types'
import UserDialog from './components/user-dialog.vue'
import { useLocalCrud } from '@renderer/utils/localCrud'
import { PartialBy } from '@renderer/types/optional'
import { ElMessage } from 'element-plus'

const USER_STATUS = [
  { key: '0', value: '禁用' },
  { key: '1', value: '启用' }
]
const form = reactive({
  userName: '',
  status: ''
})

const vegetable = inject(Vegetable)
const userDialogRef = ref()

onMounted(() => {
  queryAll()
})

const {
  queryAll,
  queryData: userList,
  handleStatus,
  handleEditOrAdd,
  edit,
  add,
  remove
} = useLocalCrud<UserType>(vegetable!.user, toRaw(form), userDialogRef)

const updateStatus = (row: UserType) => {
  const { id, status } = row
  message(`确认将${row.status === '0' ? '启用' : '禁用'}用户${row.userName}?`, () => {
    edit({ id, status: status === '1' ? '0' : '1' }, queryAll)
  })
}

const resetPassword = (row: UserType) => {
  const { userName } = row
  message(`确认将重置用户${userName}密码为初始密码?`, () => {
    vegetable!.user?.resetPassword(toRaw(row)).then(res => {
      if (res.code === 0) {
        ElMessage({
          message: res.msg,
          type: 'success'
        })
      }
    })
  })
}

const handleDelete = (row: UserType) => {
  remove(`${row.userName}删除后无法恢复，是否删除？`, [row.id], queryAll)
}

const onSubmit = (data: PartialBy<UserType, 'id'>) => {
  data.id ? edit(data, queryAll) : add(data, queryAll)
}
</script>

<style lang="scss" scoped>
.popper {
  .el-button {
    display: block;
    margin-left: 0;
  }
}
</style>
