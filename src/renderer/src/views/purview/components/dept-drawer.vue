<template>
  <JCDrawer
    :title="data.handleType === HandleType.add ? '新增部门' : '编辑部门'"
    :visible="visible"
    @close="close"
    @submit="submit"
    :submitButton="data.handleType === HandleType.add ? '新增' : '保存'"
  >
    <el-form ref="formRef" label-position="top" :model="data" :rules="rules">
      <el-form-item label="部门名称" prop="deptName">
        <el-input v-model="data.deptName" maxlength="50" />
      </el-form-item>
      <el-form-item :label="parentLabel" prop="parentName">
        <el-input v-model="data.parentName" disabled />
      </el-form-item>
    </el-form>
  </JCDrawer>
</template>
<script setup name="DeptDrawer" lang="ts">
import { HandleType } from '@renderer/types'
import type { DeptListData } from '@renderer/types/dept'
import type { FormInstance, FormRules } from 'element-plus'
import { reactive, ref } from 'vue'

defineProps<{ visible: boolean }>()
const emit = defineEmits(['update:visible', 'submit'])

const formRef = ref<FormInstance>()
const parentLabel = ref('')

const data = ref<Partial<DeptListData & { handleType: HandleType }>>({})

const rules = reactive<FormRules>({
  deptName: [{ required: true, message: '部门名称必填', trigger: 'blur' }],
  parentName: [{ required: true }]
})

const close = () => {
  emit('update:visible', false)
  reset()
}
const init = (initialData: DeptListData & { handleType: HandleType }) => {
  const isAdd = initialData.handleType === HandleType.add
  if (isAdd) {
    data.value.parentId = initialData.deptId
    data.value.parentName = initialData.deptName
    data.value.deptName = ''
    data.value.handleType = initialData.handleType
  } else {
    data.value = initialData
  }
  parentLabel.value = initialData.ancestors === 0 ? '组织' : '上级部门'
}

const reset = () => {
  formRef.value?.resetFields()
}

const submit = () => {
  formRef.value?.validate(valid => {
    if (valid) {
      emit('submit', data.value)
    }
  })
}

defineExpose({ init, reset })
</script>
