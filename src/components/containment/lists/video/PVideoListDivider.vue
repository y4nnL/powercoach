<script setup lang="ts">
import PIcon from '@/components/icons/PIcon.vue'
import PVideoListToolbarDivider from '@/components/containment/toolbars/PVideoListToolbarDivider.vue'

export type PVideoListDividerProps = {
  title?: string
  subtitle?: string
}

const props = defineProps<PVideoListDividerProps>()
</script>

<template>
  <div
    class="PVideoListDivider py-1 navbar-brand small bg-dark text-bg-dark ps-3 d-flex align-items-center"
    :class="{ 'pt-4 pb-2': Boolean(props.title) }"
  >
    <span class="d-inline-flex align-items-center opacity-75">
      {{ props.title }}
      <PVideoListToolbarDivider v-if="props.subtitle"></PVideoListToolbarDivider>
      <span v-if="props.subtitle">{{ props.subtitle }}</span>
    </span>
  </div>
</template>

<style scoped>
.PVideoListDivider {
  line-height: 1.1rem !important;
  font-family: var(--p-title-font-family), sans-serif;
}
</style>
