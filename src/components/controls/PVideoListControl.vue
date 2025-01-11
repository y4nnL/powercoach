<script setup lang="ts">
import { Scale } from '@/types'

const scale = defineModel<Scale>('scale', { required: true })

const emit = defineEmits<{
  'update:filters': [filters: number]
}>()
</script>

<template>
  <div>PVideoListControl ({{ scale }} scale)</div>
</template>

<style scoped lang="scss"></style>
