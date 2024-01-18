<template>
  <div>
    <el-table :data="tableData">
      <el-table-column prop="nickName" label="员工姓名" />
      <el-table-column prop="userName" label="账号" />
      <el-table-column prop="roleName" label="角色" />
      <el-table-column prop="phoneNumber" label="手机号码" />
      <el-table-column prop="status" label="状态">
        <template #default="{ row }">
          <el-tag :type="row.status == 0 ? 'success' : 'warning'">{{
            row.status == 0 ? '启用' : '停用'
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="deptName" label="部门" />
    </el-table>
  </div>
</template>
<script lang="ts" setup name="DeptUserTable">
defineProps(['tableData'])
</script>
