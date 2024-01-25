<template>
  <div class="container">
    <div class="bread-crumb">员工管理</div>
    <div class="container-main">
      <el-card class="flex-1 flex-column">
        <div class="mb16 justify-content-end">
          <el-button type="primary" @click="handleEditOrAdd(HandleType.add)">新增</el-button>
        </div>
        <el-table :data="userList">
          <el-table-column prop="userName" label="姓名" />
          <el-table-column prop="phone" label="手机号码" />
          <el-table-column prop="email" label="邮箱" />
          <el-table-column prop="role" label="角色" />
          <el-table-column prop="remark" label="备注" />
          <el-table-column label="操作" align="center" width="280">
            <template #default="{ row }">
              <!-- <el-button type="primary" text @click="reset(row)">重置密码</el-button> -->
              <!-- <el-button type="primary" text @click="handleEditOrAdd(row)">编辑</el-button> -->
              <el-button type="primary" text @click="updateStatus(row)">{{
                row.status === '0' ? '启用' : '禁用'
              }}</el-button>
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
import { inject, onMounted, ref } from 'vue'
import { Vegetable } from '@renderer/modules/provide'
import { message } from '@renderer/utils/message'
import { HandleType } from '@renderer/types'
import UserDialog from './components/user-dialog.vue'
import { useLocalCrud } from '@renderer/utils/localCrud'
import { PartialBy } from '@renderer/types/optional'

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
  add
} = useLocalCrud<UserType>(vegetable!.user, { userName: 't-name' }, userDialogRef)

const updateStatus = (row: UserType) => {
  const { id, status } = row
  message(`确认将${row.status === '0' ? '启用' : '禁用'}用户${row.userName}?`, () => {
    edit({ id, status: status === '1' ? '0' : '1' }, queryAll)
  })
}

const onSubmit = (data: PartialBy<UserType, 'id'>) => {
  data.id ? edit(data) : add(data)
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
@renderer/utils/localCrud
