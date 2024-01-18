<template>
  <el-scrollbar>
    <el-tree
      :data="tableData"
      node-key="deptId"
      default-expand-all
      highlight-current
      :expand-on-click-node="false"
      @node-click="handleNodeClick"
      class="dept-tree"
    >
      <template #default="{ data }">
        <span class="dept-tree-node">
          <div class="dept-tree-label">
            <SvgIcon name="folder" />
            <span>{{ data.deptName }}</span>
          </div>
          <SvgIcon
            name="add"
            v-if="data.parentId === 0"
            @click="onPlusClick(data)"
            class="tree-handle"
          />
          <el-dropdown
            v-else
            trigger="click"
            @command="handleCommand($event, data)"
            class="tree-handle"
          >
            <SvgIcon name="more" />
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="edit">编辑部门</el-dropdown-item>
                <el-dropdown-item command="create">新增下级部门</el-dropdown-item>
                <el-dropdown-item v-if="!data.children?.length" command="remove"
                  >删除部门</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </span>
      </template>
    </el-tree>
  </el-scrollbar>
</template>
<script lang="ts" setup name="DeptTree">
import { HandleType } from '@renderer/types'
import type { DeptListData } from '@renderer/types/dept'

defineProps(['tableData'])
const emit = defineEmits(['nodeClick', 'handleEditOrAdd', 'handleDelete'])

const handleNodeClick = (data: DeptListData) => {
  emit('nodeClick', data)
}

const handleCommand = (command: string, data: DeptListData) => {
  switch (command) {
    case 'create':
      emit('handleEditOrAdd', data, HandleType.add)
      break
    case 'edit':
      emit('handleEditOrAdd', data, HandleType.edit)
      break
    case 'remove':
      emit('handleDelete', data)
      break
    default:
      break
  }
}

const onPlusClick = (data: DeptListData) => {
  emit('handleEditOrAdd', data, HandleType.add)
}
</script>
<style lang="scss" scoped>
.dept-tree {
  --el-tree-node-content-height: 38px;
  &-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 8px;
  }
  &-label {
    display: flex;
    align-items: center;
    span {
      padding-left: 4px;
    }
  }
  .tree-handle {
    display: none;
  }
  .el-tree-node__content:hover,
  /* .el-tree-node__children .el-tree-node.is-current > .el-tree-node__content, */
  .el-tree-node.is-current > .el-tree-node__content {
    .tree-handle {
      display: inline-flex;
    }
  }
}
</style>
