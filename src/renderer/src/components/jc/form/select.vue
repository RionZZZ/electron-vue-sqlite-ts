<template>
  <el-col :span="4">
    <el-form-item :prop="prop">
      <div class="jc-select">
        <div class="prepend">
          {{ props.label }}
        </div>
        <el-select v-model="select" :="$attrs" class="select">
          <slot></slot>
        </el-select>
      </div>
    </el-form-item>
  </el-col>
</template>
<script setup lang="ts" name="JCSelect">
import { computed } from 'vue'

const props = defineProps(['modelValue', 'label', 'prop'])
const emit = defineEmits(['update:modelValue'])

const select = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  }
})
</script>
<style lang="scss" scoped>
.jc-select {
  display: flex;
  height: 38px;
  width: 100%;
  line-height: 38px;
  border: 1px solid #dcdfe6;
  border-radius: 2px;
  .select {
    --el-component-size: 38px;
    :deep(.el-select__wrapper) {
      box-shadow: none !important;
      height: 100%;
    }
  }
}
</style>
