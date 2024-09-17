<script setup lang="ts">
export type PVideoListDividerProps = {
  title: string
  subtitle?: string
}

const props = defineProps<PVideoListDividerProps>()
</script>

<template>
  <div
    class="PVideoListDivider navbar-brand small bg-dark text-bg-dark ps-3 py-3"
    style="--bs-dark-rgb: 13, 17, 21"
  >
    <span class="opacity-50">
      {{ props.title }}
      <span class="opacity-50 small d-block" v-if="props.subtitle">{{ props.subtitle }}</span>
    </span>
  </div>
</template>

<style scoped>
.PVideoListDivider {
  line-height: 1.1rem !important;
}
</style>
