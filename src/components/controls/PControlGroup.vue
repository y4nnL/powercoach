<script setup lang="ts">
export type PControlGroupProps = {
  hint?: string
  title?: string
}

const props = defineProps<PControlGroupProps>()
</script>

<template>
  <div class="small ps-3 mb-1 text-uppercase text-light text-opacity-50">
    <slot name="title">
      <small>{{ props.title }}</small>
    </slot>
  </div>
  <div class="card bg-light border-0 bg-opacity-25">
    <div class="card-body d-flex flex-column">
      <slot></slot>
    </div>
  </div>
  <div class="small px-3 text-light text-opacity-50 lh-1 mt-2">
    <slot name="hint">
      <small>{{ props.hint }}</small>
    </slot>
  </div>
</template>

<style lang="scss" scoped>
@import 'bootstrap/dist/css/bootstrap';
:deep(.PControl) {
  &:not(:last-child) {
    --bs-border-color: rgba(1, 1, 1, 0.1);
    @extend .border-bottom;
    padding-bottom: 0.5rem !important;
  }
  &:not(:first-child) {
    padding-top: 0.5rem !important;
  }
}
</style>
