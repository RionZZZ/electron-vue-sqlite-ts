<template>
  <div class="container">
    <div class="bread-crumb">员工管理</div>
    <div class="container-main">
      <el-card class="flex-1 flex-column">
        <div class="mb16 justify-content-end">
          <el-button type="primary" @click="insertUser">新增</el-button>
        </div>
        <el-table :data="queryData">
          <el-table-column prop="userName" label="姓名" />
          <el-table-column prop="phone" label="手机号码" />
          <el-table-column prop="email" label="邮箱" />
          <el-table-column prop="role" label="角色" />
          <el-table-column prop="remark" label="备注" />
          <el-table-column label="操作">
            <template #default="{ row }">
              <el-popover trigger="click" :show-arrow="false">
                <template #reference>
                  <el-button type="primary" link>更多</el-button>
                </template>
                <!-- <el-button type="primary" text @click="reset(row)">重置密码</el-button>
                <el-button type="primary" text @click="handleEditOrAdd(row)">编辑</el-button>
                <el-button type="danger" text @click="deleteInfo(row)">禁用</el-button> -->
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <!-- <UserDrawer
        title="add & edit"
        ref="userDrawer"
        v-model:visible="handleStatus"
        @submit="onSubmit"
      /> -->
    </div>
  </div>
</template>
<route> { meta: { title: "用户管理", menuIndex: '1-1' } } </route>

<script setup name="BasicUser" lang="ts">
import { inject, onMounted, ref } from 'vue'
import { Vegetable } from '@renderer/modules/provide'
// import UserDrawer from './components/user-drawer.vue'

const vegetable = inject(Vegetable)
const queryData = ref<UserType[]>([])
const queryUser = async () => {
  vegetable!.user.findAll({ offset: 0, limit: 10 }).then(users => {
    console.log(users)
    queryData.value = users
  })
}
const insertUser = async () => {
  vegetable!.user
    .create({
      userName: 'test-name',
      phone: '13411111111',
      email: '',
      remark: 'content',
      role: 'admin'
    })
    .then(res => console.log(res))
}

onMounted(() => {
  queryUser()
})

// const userDrawer = ref()

// const onSubmit = (data: PartialBy<UserData, 'userId'>) => {
// data.userId ? edit(data) : add(data)
// }
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
