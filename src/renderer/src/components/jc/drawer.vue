<template>
  <el-drawer :model-value="visible" :title="title" :before-close="handleClose">
    <slot></slot>
    <template #footer>
      <el-button @click="handleClose()">取消</el-button>
      <el-button @click="$emit('submit')" type="primary">{{ submitButton }}</el-button>
    </template>
  </el-drawer>
</template>
<script setup lang="ts" name="JCDrawer">
import { message } from '@renderer/utils/message'

withDefaults(defineProps<{ visible: boolean; title: string; submitButton?: string }>(), {
  submitButton: '保存'
})
const emit = defineEmits(['close', 'submit', 'update:visible'])

const handleClose = (done?: () => void) => {
  message('退出当前操作将无法保存您所编辑的信息，确定要退出吗？', () => {
    done?.()
    emit('close')
  })
}
</script>
