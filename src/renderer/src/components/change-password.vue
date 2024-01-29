<template>
  <el-dialog
    :model-value="visible"
    title="修改密码"
    width="40%"
    @close="handleClose"
    :close-on-click-modal="false"
  >
    <el-form
      :model="form"
      ref="formRef"
      :rules="rules"
      class="change-password-form"
      label-position="top"
      hide-required-asterisk="true"
    >
      <el-form-item prop="account" label="账号">
        <el-input v-model="form.account" disabled />
      </el-form-item>
      <el-form-item prop="password" label="原密码">
        <el-input v-model="form.password" placeholder="请输入" type="password" show-password />
      </el-form-item>
      <el-form-item prop="newPassword" label="新密码">
        <el-input v-model="form.newPassword" placeholder="请输入" type="password" show-password />
      </el-form-item>
      <el-form-item prop="confirmPassword" label="确认新密码">
        <el-input
          v-model="form.confirmPassword"
          placeholder="请输入"
          type="password"
          show-password
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="drawer-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="confirm(ruleFormRef)" :loading="loading">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { UserStore } from '@renderer/stores'
import type { FormInstance, FormRules } from 'element-plus'

defineProps<{ visible: boolean }>()
const emit = defineEmits(['update:visible'])

interface RuleForm {
  account: string
  password: string
  newPassword: string
  confirmPassword: string
}
const userStore = UserStore()
const form = reactive<RuleForm>({
  account: userStore.userName,
  password: '',
  newPassword: '',
  confirmPassword: ''
})
const loading = ref(false)
const formRef = ref<FormInstance>()

const validatePass = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入新密码'))
  } else {
    if (form.confirmPassword !== '') {
      formRef.value?.validateField('confirmPassword', () => null)
    }
    callback()
  }
}
const validatePass2 = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入新密码'))
  } else if (value !== form.newPassword) {
    callback(new Error('两次输入的密码不相同'))
  } else {
    callback()
  }
}

const rules = reactive<FormRules<RuleForm>>({
  account: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: { required: true, message: '请输入原密码', trigger: 'blur' },
  newPassword: { validator: validatePass, trigger: 'blur' },
  confirmPassword: { validator: validatePass2, trigger: 'blur' }
})

const handleClose = () => {
  emit('update:visible', false)
  formRef.value?.resetFields()
}

const confirm = async () => {
  loading.value = true
  await formRef.value?.validate(valid => {
    loading.value = false
    if (valid) {
      handleClose()
    }
  })
}
</script>
