<script setup lang="ts">
import { useDb } from '@renderer/utils/db'
import { onMounted } from 'vue'

const { connectDb } = useDb()
onMounted(connectDb)
</script>

<template>
  <RouterView />
</template>
