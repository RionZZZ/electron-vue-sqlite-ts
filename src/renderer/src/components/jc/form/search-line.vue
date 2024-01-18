<template>
  <el-row :gutter="16" class="search-line">
    <slot></slot>
    <el-col :span="4" v-if="showHandle">
      <el-button size="large" type="primary" @click="$emit('search')">查询</el-button>
      <el-button size="large" @click="reset">重置</el-button>
    </el-col>
  </el-row>
</template>
<script setup lang="ts" name="JCSearchLine">
import type { FormInstance } from 'element-plus'
import { type Ref, inject } from 'vue'

// const props = withDefaults(defineProps<{ showHandle?: boolean; formRef?: FormInstance }>(), {
//   showHandle: true
// })

defineProps({ showHandle: { type: Boolean, default: true } })
const emits = defineEmits(['search'])

const formRef = inject<Ref<FormInstance>>('formRef')

const reset = () => {
  formRef?.value.resetFields()
  emits('search')
}
</script>
<style lang="scss" scoped>
.search-line {
  & + & {
    margin-top: 16px;
  }
  :deep(.el-form-item) {
    margin-bottom: 0;
    .prepend {
      flex-shrink: 0;
      background-color: #f5f7fa;
      color: #666666;
      padding: 0 20px;
      border-right: 1px solid #dcdfe6;
      font-size: var(--el-font-size-base);
    }
  }
}
</style>
