<template>
	<div>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>我的信息</span>
        </div>
      </template>
      <el-form :inline="true" :model="form">
        <el-form-item label="接收日期">
          <el-date-picker v-model="form.time" type="daterange" range-separator="至" />
        </el-form-item>
        <el-form-item label="关键词">
          <el-input v-model="form.value" clearable/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card" style="margin-top: 20px">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="type" label="消息类型" />
        <el-table-column prop="content" label="消息内容" />
        <el-table-column prop="time" label="接收时间" />
        <el-table-column prop="name1" label="接收人" />
        <el-table-column prop="name2" label="发送方" />
      </el-table>
      <div style="float: right; margin: 20px 0">
        <el-pagination
          :page-sizes="[10, 20, 50, 100]"
          :small="false"
          :disabled="false"
          :background="false"
          layout="sizes, prev, pager, next"
          :total="1"
        />
      </div>
    </el-card>
  </div>
</template>
<route> { meta: { title: "我的信息"} } </route>

<script setup name="BasicTechnology" lang="ts">
import { ref, reactive } from 'vue'
const form = reactive({
  time: null,
  value: null
})

const tableData = ref([
  {
    type: '证书到期提醒',
    content: '【证书到期提醒】您好，您的xx证书将于三个月后到期，请及时处理。',
    time: '2023-07-01',
    name1: '某某',
    name2:'系统'
  }
])

const reset = () => {
  form.time = null
  form.value = null
}
</script>
