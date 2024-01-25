<template>
  <JCDialog
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
    </el-form>
  </JCDialog>
</template>
<script setup name="UserDialog" lang="ts">
import type { UserData } from '@renderer/types/user'
import { HandleType } from '@renderer/types'
import { ref, reactive } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

defineProps<{ visible: boolean }>()
const emit = defineEmits(['update:visible', 'submit'])

const data = ref<Partial<UserData & { handleType: HandleType }>>({})

const close = () => {
  emit('update:visible', false)
  reset()
}
const init = (initialData: UserData) => {
  data.value = { ...data.value, ...initialData }
  console.log('data.value', data.value)
}

const reset = () => {
  formRef.value?.resetFields()
}

defineExpose({ init, reset })

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

const rules = reactive<FormRules<UserData>>({
  userName: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  phoneNumber: [
    { required: true, message: '请输入手机号码', trigger: 'blur' },
    { pattern: /^[0-9]{11}$/, message: '请正确输入11位手机号码', trigger: 'blur' }
  ],
  nickName: [{ required: true, message: '请输入员工姓名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  deptId: [{ required: true, message: '请选择部门', trigger: 'change' }],
  roleIds: [{ required: true, message: '请选择角色', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
})
</script>
<style lang="scss" scoped>
:deep(.el-cascader) {
  width: 100%;
}
</style>
