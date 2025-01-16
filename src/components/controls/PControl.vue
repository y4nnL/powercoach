<script setup lang="ts">
export type PControlProps = {
  hint?: string
  title?: string
}

const props = defineProps<PControlProps>()
</script>

<template>
  <div class="small ps-3 mb-1 text-uppercase text-light text-opacity-50">
    <slot name="title">
      <small>{{ props.title }}</small>
    </slot>
  </div>
  <div class="card bg-light border-0 bg-opacity-25">
    <div class="card-body">
      <slot></slot>
    </div>
  </div>
  <div class="small px-3 text-light text-opacity-50 lh-1 mt-2">
    <slot name="hint">
      <small>{{ props.hint }}</small>
    </slot>
  </div>
</template>
