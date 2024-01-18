<template>
  <el-col :span="6">
    <el-form-item :prop="prop">
      <div class="jc-date-picker">
        <div class="prepend">
          {{ props.label }}
        </div>
        <el-date-picker
          v-model="datePicker"
          :="$attrs"
          class="date-picker"
          type="daterange"
          value-format="YYYY-MM-DD"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </div>
    </el-form-item>
  </el-col>
</template>
<script setup lang="ts" name="JCDatePicker">
import { computed } from 'vue'

const props = defineProps(['modelValue', 'label', 'prop'])
const emit = defineEmits(['update:modelValue'])

const datePicker = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  }
})
</script>
<style lang="scss" scoped>
.jc-date-picker {
  display: flex;
  height: 38px;
  width: 100%;
  line-height: 38px;
  border: 1px solid #dcdfe6;
  border-radius: 2px;
  :deep(.date-picker) {
    --el-component-size: 38px;
    .el-range__icon {
      display: none;
    }
    box-shadow: none !important;
  }
}
</style>
