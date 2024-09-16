<script setup lang="ts">
export type PScaleTransitionProps = {
  direction: 'in' | 'out'
}

const props = defineProps<PScaleTransitionProps>()
</script>

<template>
  <transition :name="`scale-${props.direction}`">
    <slot></slot>
  </transition>
</template>

<style>
.scale-in-enter-active,
.scale-in-leave-active,
.scale-out-enter-active,
.scale-out-leave-active {
  transition:
    opacity 0.3s ease-in-out,
    transform 0.3s ease-in-out;
}
.scale-in-enter-from,
.scale-out-leave-to {
  transform: scale(0.8);
  opacity: 0;
}
.scale-out-enter-from,
.scale-in-leave-to {
  transform: scale(1.2);
  opacity: 0;
}
</style>
