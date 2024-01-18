<template>
  <el-col :span="4">
    <el-form-item :prop="prop">
      <div class="jc-input">
        <div class="prepend">
          {{ props.label }}
        </div>
        <el-input v-model="input" :="$attrs" class="input" />
      </div>
    </el-form-item>
  </el-col>
</template>
<script setup lang="ts" name="JCInput">
import { computed } from 'vue'

const props = defineProps(['modelValue', 'label', 'prop'])
const emit = defineEmits(['update:modelValue'])

const input = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  }
})
</script>
<style lang="scss" scoped>
.jc-input {
  display: flex;
  height: 38px;
  line-height: 38px;
  border: 1px solid #dcdfe6;
  border-radius: 2px;
  .input {
    :deep(.el-input__wrapper) {
      box-shadow: none !important;
    }
  }
}
</style>
