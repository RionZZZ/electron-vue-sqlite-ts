<template>
  <el-drawer
    v-model="changePassword"
    title="修改密码"
    width="30%"
    @close="handleClose"
    size="698"
    :close-on-click-modal="false"
  >
    <el-form
      :model="form"
      ref="ruleFormRef"
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
        <el-button @click="changePassword = false">取消</el-button>
        <el-button type="primary" @click="confirm(ruleFormRef)" :loading="loading">
          确认
        </el-button>
      </span>
    </template>
  </el-drawer>
</template>

<script lang="ts" setup>
import { reactive, ref, computed } from 'vue'
// import { storeToRefs } from 'pinia'
import { UserStore } from '@renderer/stores'
import type { FormInstance, FormRules } from 'element-plus'

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

const ruleFormRef = ref<FormInstance>()

const validatePass = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入新密码'))
  } else {
    if (form.confirmPassword !== '') {
      if (!ruleFormRef.value) {
        return
      }
      ruleFormRef.value.validateField('confirmPassword', () => null)
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
// const { changeState } = userStore
// const { password } = storeToRefs(userStore)
const props = defineProps({
  changePassword: {
    type: Boolean
  }
})
const emit = defineEmits(['closeChange'])
const changePassword = computed({
  get() {
    return props.changePassword
  },
  set(value) {
    emit('closeChange', value)
  }
})

const handleClose = () => {
  resetForm(ruleFormRef.value)
}

const confirm = async (formEl: FormInstance | undefined) => {
  loading.value = true
  if (!formEl) {
    return
  }
  await formEl.validate((valid, fields) => {
    loading.value = false
    if (valid) {
      handleClose()
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  formEl.resetFields()
}
</script>

<style lang="scss" scoped>
.change-password-form {
  margin: 0 120px;
}
</style>
