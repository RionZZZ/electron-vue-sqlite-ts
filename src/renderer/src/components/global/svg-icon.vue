<template>
  <svg :style="{ width: `${size}px`, height: `${size}px` }">
    <use :xlink:href="'#icon-' + name" :fill="color" />
  </svg>
</template>

<script setup lang="ts" name="SvgIcon">
withDefaults(defineProps<{ name: string; color?: string; size?: string | number }>(), {
  size: 16
})
</script>
