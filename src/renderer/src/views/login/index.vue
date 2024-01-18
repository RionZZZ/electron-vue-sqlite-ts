<template>
  <div class="login">
    <div class="login-box">
      <div class="login-img">
        <img src="@renderer/assets/images/login/people.png" alt="" />
      </div>
      <div class="login-content">
        <div class="login-content-title">您好</div>
        <div class="login-content-subtitle">欢迎使用权限系统</div>
        <el-form
          :model="loginForm"
          ref="ruleFormRef"
          :rules="rules"
          class="login-form"
          label-position="top"
          hide-required-asterisk="true"
        >
          <el-form-item prop="userName" label="账号">
            <el-input
              v-model="loginForm.userName"
              placeholder="请输入"
              clearable
              @keyup.enter="handleLogin(ruleFormRef)"
            />
          </el-form-item>
          <el-form-item prop="password" label="密码">
            <el-input
              v-model="loginForm.password"
              placeholder="请输入"
              type="password"
              show-password
              @keyup.enter="handleLogin(ruleFormRef)"
            />
          </el-form-item>
        </el-form>
        <el-button
          class="login-button"
          type="primary"
          @click="handleLogin(ruleFormRef)"
          :loading="loading"
        >
          立即登录
        </el-button>
      </div>
    </div>
  </div>
</template>
<route> { meta: { layout: false } } </route>
<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

import { UserStore } from '@renderer/stores'
import { useRouter } from 'vue-router'
import { AuthApi } from '@renderer/api'

interface RuleForm {
  userName: string
  password: string
}

const router = useRouter()
const jumpHome = () => {
  router.push('/purview/user')
}
const loginForm = reactive<RuleForm>({
  userName: 'admin',
  password: 'admin123'
})

const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules<RuleForm>>({
  userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: { required: true, message: '请输入密码', trigger: 'blur' }
})

const userStore = UserStore()
const { changeState } = userStore
const loading = ref(false)

const handleLogin = async (formEl: FormInstance | undefined) => {
  loading.value = true
  if (!formEl) {
    return
  }
  await formEl.validate((valid, fields) => {
    loading.value = false
    if (valid) {
      AuthApi.login(loginForm).then(res => {
        if (res.code === 0) {
          changeState('token', res.data)
          changeState('userName', loginForm.userName)
          jumpHome()
        }
      })
    }
  })
}
</script>

<style lang="scss" scoped>
.login {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-image: url('../../assets/images/login/bg.png');
  background-size: cover;
  &-box {
    overflow: hidden;
    height: 586px;
    width: 1180px;
    display: flex;
    border-radius: 8px;
  }
  &-img img {
    height: 100%;
  }
  &-content {
    width: 590px;
    box-sizing: border-box;
    padding: 110px 124px;
    background-color: #ffffff;
    font-weight: 400;
    &-title {
      font-size: 28px;
      color: #3a81fc;
      line-height: 39px;
    }
    &-subtitle {
      margin-top: 8px;
      font-size: 20px;
      color: #333333;
      line-height: 28px;
    }
  }
  &-form {
    margin-top: 40px;
  }
  &-button {
    width: 100%;
    margin-top: 6px;
  }
}
</style>
