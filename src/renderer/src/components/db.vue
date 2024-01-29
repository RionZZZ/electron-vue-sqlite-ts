<script setup lang="ts">
import { useDb } from '@renderer/utils/db'
import { onMounted } from 'vue'
const { dbState, connectDb } = useDb()

onMounted(() => {
  setTimeout(() => {
    connectDb()
  }, 1000)
})

const type = {
  connected: 'success',
  connecting: 'warning',
  error: 'danger',
  disconnected: 'danger'
}
</script>

<template>
  <el-tag :type="type[dbState]" effect="dark" round>sqlite {{ dbState }}</el-tag>
</template>

