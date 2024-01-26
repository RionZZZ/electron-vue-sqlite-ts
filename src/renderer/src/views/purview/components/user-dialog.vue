<template>
  <JCDialog
    :title="data.id ? '编辑用户信息' : '新增用户信息'"
    :visible="visible"
    @close="close"
    @submit="submit"
  >
    <el-form ref="formRef" label-position="top" :rules="rules" :model="data">
      <el-form-item label="用户姓名" prop="userName">
        <el-input
          v-model.trim="data.userName"
          maxlength="20"
          placeholder="请输入用户姓名"
          clearable
        />
      </el-form-item>
      <el-form-item label="手机号码" prop="phone">
        <el-input v-model="data.phone" type="number" placeholder="请输入手机号码" clearable />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model.trim="data.email" placeholder="请输入邮箱" clearable />
      </el-form-item>
      <el-form-item label="角色" prop="role">
        <el-select v-model="data.role" placeholder="请选择角色" style="width: 100%">
          <el-option
            v-for="role in roleList"
            :key="role.key"
            :label="role.value"
            :value="role.key"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" v-model="data.remark" placeholder="请输入备注信息" />
      </el-form-item>
    </el-form>
  </JCDialog>
</template>
<script setup name="UserDialog" lang="ts">
import { HandleType } from '@renderer/types'
import { ref, reactive } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

const roleList = [
  { value: '普通用户', key: 'user' },
  { value: '管理员', key: 'admin' },
  { value: '财务人员', key: 'finance' }
]

defineProps<{ visible: boolean }>()
const emit = defineEmits(['update:visible', 'submit'])

const data = ref<Partial<UserType & { handleType: HandleType }>>({})

const close = () => {
  emit('update:visible', false)
  reset()
}
const init = (initialData: UserType) => {
  data.value = { ...data.value, ...initialData }
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
  await formRef.value.validate(valid => {
    if (valid) {
      emit('submit', data.value)
    }
  })
}

const rules = reactive<FormRules<UserType>>({
  userName: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入手机号码', trigger: 'blur' },
    { pattern: /^[0-9]{11}$/, message: '请正确输入11位手机号码', trigger: 'blur' }
  ],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }]
})
</script>
