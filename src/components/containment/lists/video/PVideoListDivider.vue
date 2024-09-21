<script setup lang="ts">
import PIcon from '@/components/icons/PIcon.vue'

export type PVideoListDividerProps = {
  title?: string
  subtitle?: string
}

const props = defineProps<PVideoListDividerProps>()
</script>

<template>
  <div
    class="PVideoListDivider py-1 navbar-brand small bg-dark text-bg-dark ps-3 d-flex align-items-center"
    :class="{ 'py-3': Boolean(props.title) }"
    style="--bs-dark-rgb: 13, 17, 21"
  >
    <span class="d-inline-flex align-items-center opacity-75">
      {{ props.title }}
      <PIcon v-if="props.subtitle" class="opacity-25" :size="24" :path="'mdiChevronRight'"></PIcon>
      <span v-if="props.subtitle">{{ props.subtitle }}</span>
    </span>
  </div>
</template>

<style scoped>
.PVideoListDivider {
  line-height: 1.1rem !important;
}
</style>
