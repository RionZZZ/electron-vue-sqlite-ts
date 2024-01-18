<template>
  <el-dialog v-model="isExport" title="提示" :before-close="close">
    <span>确认导出数据</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="isExport = false">取消</el-button>
        <el-button type="primary" @click="confirm"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup name="ExportFile">
import { computed } from 'vue'
import { ElMessage } from 'element-plus'
// import exportFile from '../utils/export'

const props = defineProps({
  isExport: {
    type: Boolean
  },
  path:{
    type:String
  }
})
const emit = defineEmits(['closeExport'])
const isExport = computed({
  get() {
    return props.isExport
  },
  set(value) {
    emit('closeExport', value)
  }
})
const close = (done: () => void) => {
  done()
}
const confirm = () => {
  // exportFile()
  const a = document.createElement('a')
  a.href = `src/static/${props.path}.xlsx`
  a.download = `${props.path}.xlsx`
  a.style.display = 'none'
  document.body.appendChild(a)
  a.click()
  a.remove()
  ElMessage.success('导出成功')
  isExport.value = false
}
</script>
<style lang="scss" scoped>
</style>