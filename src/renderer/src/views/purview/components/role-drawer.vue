<template>
  <JCDrawer
    :title="data.roleId ? '编辑' : '新增' + title"
    :visible="visible"
    @close="close"
    :submitButton="data.roleId ? '保存' : '新增'"
    @submit="submit"
  >
    <el-form ref="formRef" label-position="top" :rules="rules" :model="data">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model.trim="data.roleName" placeholder="请输入" maxlength="20" />
      </el-form-item>
      <el-form-item label="系统" prop="systemId">
        <el-select
          v-model="data.systemId"
          placeholder="请选择"
          @change="selectSys"
          disabled
          style="width: 100%"
        >
          <el-option v-for="(i, index) in sysList" :key="index" :label="i.label" :value="i.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="权限设置" prop="menuIds">
        <el-tree
          ref="treeRef"
          :data="authTree"
          show-checkbox
          default-expand-all
          check-on-click-node
          :expand-on-click-node="false"
          node-key="menuId"
          :props="{ label: 'menuName', class: data => (data.children ? '' : 'is-last') }"
          style="width: 100%"
          @check-change="treeCheck"
        />
      </el-form-item>
    </el-form>
  </JCDrawer>
</template>
<script setup name="RoleDrawer" lang="ts">
import type { RoleForm, authTreeType, menuTree } from '@renderer/types/role'
import { ref, reactive, onMounted } from 'vue'
import { RoleApi } from '@renderer/api'
import { ElTree } from 'element-plus'

defineProps<{ visible: boolean; title: string }>()
const emit = defineEmits(['update:visible', 'submit'])

const data = ref<Partial<RoleForm>>({})
const treeRef = ref<InstanceType<typeof ElTree>>()
const sysList = ref<authTreeType[]>([])
const formRef = ref()
const authTree = ref<menuTree[]>([])

const close = () => {
  emit('update:visible', false)
  reset()
}
const init = (initialData: Partial<RoleForm>) => {
  data.value.menuIds = []
  data.value.systemId = initialData.systemId
  data.value.systemName = sysList.value?.find(e => e.id === initialData.systemId)?.label

  treeRef.value?.setCheckedKeys([], false)

  initialData.systemId &&
    RoleApi.getAuthBySys(initialData.systemId).then(res => {
      authTree.value = res.data

      if (initialData.roleId) {
        data.value.roleId = initialData.roleId

        RoleApi.getRoleInfo(initialData.roleId as number).then(res => {
          data.value.roleName = res.data.roleName

          const menus = handleAuthTree(res.data.menus)
          treeRef.value!.setCheckedKeys(menus.flat())
        })
      }
    })
}

const reset = () => {
  data.value = {}
  formRef.value?.resetFields()
}

const submit = async () => {
  if (!formRef.value) {
    return
  }
  await formRef.value.validate((valid: boolean) => {
    if (valid) {
      emit('submit', data.value)
    }
  })
}

const selectSys = (val: number) => {
  RoleApi.getAuthBySys(val).then(res => {
    console.log(res)
  })
}

const treeCheck = () => {
  data.value.menuIds = treeRef.value!.getCheckedKeys().concat(treeRef.value!.getHalfCheckedKeys())
}

defineExpose({ init, reset })
const rules = reactive({
  roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }]
  // menuIds: [{ required: true, type: 'array', message: '请选择至少一个选项', trigger: 'change' }]
})

onMounted(() => {
  RoleApi.getSysList().then(res => {
    sysList.value = res.data
  })
})

const handleAuthTree = (tree: menuTree[]) => {
  const newTree: (number | number[])[] = tree.map((e: menuTree) => {
    if (e.children) {
      const tempMenus = e.children.map(e => e.menuId)
      return [...tempMenus]
    } else {
      return e.menuId
    }
  })
  return newTree
}
</script>

<style scoped lang="scss">
:deep(.el-tree-node.is-expanded > .el-tree-node__children) {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
:deep(.el-tree-node__children > div) {
  width: 100%;
}
:deep(.el-tree-node__children > .is-last) {
  width: 33.33%;
  display: inline-block;
}
</style>
