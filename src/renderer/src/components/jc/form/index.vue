<template>
  <el-form ref="form">
    <slot></slot>
  </el-form>
</template>
<script setup lang="ts" name="JCSearchForm">
import { provide, ref } from 'vue'
import type { FormInstance } from 'element-plus'

const form = ref<FormInstance>()
provide('formRef', form)
</script>
<style lang="scss" scoped></style>
