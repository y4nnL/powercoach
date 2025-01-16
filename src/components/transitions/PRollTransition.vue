<script setup lang="ts">
import { useMainScroll } from '@/composables/useMainScroll'
import { toRefs } from 'vue'

const { top: isMainScrollingUp, bottom: isMainScrollingDown } = toRefs(useMainScroll().directions)
</script>
<template>
  <transition :name="`roll-${isMainScrollingUp ? 'down' : isMainScrollingDown ? 'up' : 'none'}`">
    <slot></slot>
  </transition>
</template>

<style>
.roll-up-enter-active,
.roll-up-leave-active,
.roll-down-enter-active,
.roll-down-leave-active {
  transition:
    transform ease-in var(--p-transition-time-lg),
    opacity var(--p-transition-time-lg);
}
.roll-up-enter-active,
.roll-down-enter-active {
  transition-timing-function: cubic-bezier(1, 0.01, 0.38, 1.62);
}
.roll-up-enter-from,
.roll-down-enter-from,
.roll-up-leave-to,
.roll-down-leave-to {
  opacity: 0;
}
.roll-up-enter-from {
  transform: translateY(50%);
}
.roll-down-enter-from {
  transform: translateY(-50%);
}
.roll-none-enter-from,
.roll-none-leave-to {
  opacity: 0;
}
</style>
