<template>
  <el-col :span="4">
    <el-form-item :prop="prop">
      <div class="jc-cascader">
        <div class="prepend">
          {{ props.label }}
        </div>
        <el-cascader v-model="cascader" :="$attrs" class="cascader" />
      </div>
    </el-form-item>
  </el-col>
</template>
<script setup lang="ts" name="JCCascader">
import { computed } from 'vue'

const props = defineProps(['modelValue', 'label', 'prop'])
const emit = defineEmits(['update:modelValue'])

const cascader = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    val ? emit('update:modelValue', val.pop()) : emit('update:modelValue', '')
  }
})
</script>
<style lang="scss" scoped>
.jc-cascader {
  display: flex;
  height: 38px;
  line-height: 38px;
  border: 1px solid #dcdfe6;
  border-radius: 2px;
  :deep(.el-cascader .el-input .el-input__wrapper) {
    box-shadow: none !important;
  }
  :deep(.el-cascader .el-input .is-focus .el-input__wrapper){
    box-shadow: none !important;
  }
  :deep(.el-input){
    height: 100% !important;
  }
}

</style>
