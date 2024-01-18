<template>
  <el-dialog v-model="isImport" title="请选择导入的文件" :before-close="close">
    <el-upload
      class="upload-demo"
      accept=".xlsx, .xlsm, .xls"
      drag
      action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
      multiple
      :on-success="success"
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <template #tip>
        <div class="el-upload__tip">请拖拽或者点击文件</div>
      </template>
    </el-upload>
    <a :href="`src/static/${props.path}.xlsx`" :download="props.path">下载模板</a>
  </el-dialog>
</template>

<script lang="ts" setup name="ImportFile">
import { computed } from 'vue'
import { ElMessage } from 'element-plus'
import type { UploadProps } from 'element-plus'
const props = defineProps({
  isImport: {
    type: Boolean
  },
  path:{
    type:String
  }
})
const emit = defineEmits(['closeImport'])
const isImport = computed({
  get() {
    return props.isImport
  },
  set(value) {
    emit('closeImport', value)
  }
})

const success: UploadProps['onSuccess'] = (
  response,
  uploadFile
) => {
  ElMessage.success('上传文件成功!')
}
const close = (done: () => void) => {
  done()
}
</script>
<style lang="scss" scoped>
a{
  text-decoration: none;
}
</style>