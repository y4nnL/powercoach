<script setup lang="ts">
import { computed } from 'vue'
import { useRefStore } from '@/stores/ref'

export type PVideoListDividerProps = {
  title?: string
  subtitle?: string
}

const props = defineProps<PVideoListDividerProps>()

const toolbar = useRefStore().get('toolbar')

const minHeight = computed<string>(() =>
  props.title && toolbar.value ? `${toolbar.value.clientHeight + 1}px` : '5px'
)
</script>

<template>
  <div
    class="PVideoListDivider navbar-brand small bg-dark text-bg-dark ps-3 d-flex align-items-center"
    style="--bs-dark-rgb: 13, 17, 21"
  >
    <span v-if="props.title" class="opacity-50">
      {{ props.title }}
      <span class="opacity-50 small d-block" v-if="props.subtitle">{{ props.subtitle }}</span>
    </span>
  </div>
</template>

<style scoped>
.PVideoListDivider {
  line-height: 1.1rem !important;
  min-height: v-bind(minHeight);
}
</style>
