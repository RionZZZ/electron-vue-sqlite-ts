<script setup lang="ts">
import { useDb } from '@renderer/utils/db'
import { onMounted } from 'vue'
const { dbState, connectDb } = useDb()

onMounted(() => {
  setTimeout(() => {
    connectDb()
  }, 2000)
})
</script>

<template>
  <div>dbState-----{{ dbState }}</div>
</template>
