<template>
  <el-pagination
    class="pagination"
    :current-page="pageNum"
    :page-size="pageSize"
    :page-sizes="paginationConfig.pageSizes"
    background
    hide-on-single-page
    layout="sizes, prev, pager, next, jumper"
    @current-change="handleCurrentChange"
    @size-change="handleSizeChange"
    :total="total"
  />
</template>
<script setup lang="ts" name="JCPagination">
import { paginationConfig } from '@renderer/config'

defineProps<{ pageNum: number; pageSize: number; total: number }>()
const emit = defineEmits(['update:pageNum', 'update:pageSize', 'query'])

const handleCurrentChange = (val: number) => {
  emit('update:pageNum', val)
  emit('query')
}
const handleSizeChange = (val: number) => {
  emit('update:pageSize', val)
  emit('query')
}
</script>
<style lang="scss" scoped>
.pagination {
  margin: 20px 0;
  justify-content: flex-end;
}
</style>
