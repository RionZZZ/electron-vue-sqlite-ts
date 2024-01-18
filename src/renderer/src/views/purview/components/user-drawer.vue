<template>
  <JCDrawer
    :title="data.userId ? '编辑员工信息' : '新增员工信息'"
    :visible="visible"
    @close="close"
    @submit="submit"
  >
    <el-form ref="formRef" label-position="top" :rules="rules" :model="data">
      <el-form-item label="员工姓名" prop="nickName">
        <el-input v-model.trim="data.nickName" maxlength="32" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="手机号码" prop="phoneNumber">
        <el-input v-model="data.phoneNumber" type="number" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="账号" prop="userName">
        <el-input v-model.trim="data.userName" maxlength="20" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="密码" prop="password" v-if="!data.userId">
        <el-input v-model="data.password" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="部门" prop="deptId">
        <el-cascader
          v-model="data.deptId"
          :options="deptGroup"
          collapse-tags
          placeholder="请选择"
          :props="{ value: 'deptId', label: 'deptName', checkStrictly: true }"
          @change="deptChange"
          clearable
          width="100%"
        />
      </el-form-item>
      <el-form-item label="角色" prop="roleIds">
        <el-cascader
          v-model="data.roleIds"
          :options="rolesGroup"
          placeholder="请选择"
          :props="{ value: 'id', label: 'name', children: 'details', multiple: true }"
          @change="roleChange"
          clearable
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="data.status">
          <el-radio v-for="i in USER_STATUS" :key="i.value" :label="i.value">{{
            i.label
          }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="入职时间" prop="entryTime">
        <el-date-picker
          v-model="data.entryTime"
          value-format="YYYY-MM-DD"
          format="YYYY-MM-DD"
          type="date"
          placeholder="选择日期"
          clearable
        />
      </el-form-item>
    </el-form>
  </JCDrawer>
</template>
<script setup name="UserDrawer" lang="ts">
import type { UserData } from '@renderer/types/user'
import { HandleType } from '@renderer/types'
import { ref, reactive } from 'vue'
import { DeptApi, RoleApi } from '@renderer/api'
import type { FormInstance, FormRules } from 'element-plus'
import { USER_STATUS } from '@renderer/consts'
import type { DeptListData } from '@renderer/types/dept'
import type { authTreeType } from '@renderer/types/role'

defineProps<{ visible: boolean; title: string }>()
const emit = defineEmits(['update:visible', 'submit'])

const data = ref<Partial<UserData & { handleType: HandleType }>>({
  password: '123456',
  status: '0'
})
let rolesGroup = ref<authTreeType[]>()
let deptGroup = ref<DeptListData[]>()

const close = () => {
  emit('update:visible', false)
  reset()
}
const init = (initialData: UserData) => {
  DeptApi.fetchList<undefined, DeptListData>().then(res => {
    deptGroup.value = res.data
  })
  RoleApi.fetchList<undefined, authTreeType>().then(res => {
    rolesGroup.value = res.data
  })
  data.value = { ...data.value, ...initialData }
  console.log('data.value', data.value)
}
const formRef = ref<FormInstance | undefined>()
const submit = async () => {
  if (!formRef.value) {
    return
  }
  await formRef.value.validate((valid, fields) => {
    if (valid) {
      emit('submit', data.value)
    }
  })
}

const reset = () => {
  formRef.value?.resetFields()
}

defineExpose({ init, reset })
const rules = reactive<FormRules<UserData>>({
  userName: [
    { required: true,message: '请输入账号',trigger: 'blur'}
  ],
  phoneNumber: [
    { required: true, message: '请输入手机号码', trigger: 'blur' },
    { pattern: /^[0-9]{11}$/, message: '请正确输入11位手机号码', trigger: 'blur' }
  ],
  nickName: [
    { required: true, message: '请输入员工姓名', trigger: 'blur' }
  ],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  deptId: [{ required: true, message: '请选择部门', trigger: 'change' }],
  roleIds: [{ required: true, message: '请选择角色', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
})
const roleChange = (val: number[][]) => {
  data.value.roleIds = val.map((v: number[]) => {
    return v.pop()
  })
}
const deptChange = (val: number[]) => {
  data.value.deptId = val.pop()
}
</script>
<style lang="scss" scoped>
:deep(.el-cascader) {
  width: 100%;
}
</style>