<script setup lang="ts">
import { useMainScroll } from '@/composables/useMainScroll'
import { toRefs } from 'vue'

const { top: isMainScrollingUp, bottom: isMainScrollingDown } = toRefs(useMainScroll().directions)
</script>
<template>
  <transition :name="`roll-${isMainScrollingUp ? 'up' : isMainScrollingDown ? 'down' : 'none'}`">
    <slot></slot>
  </transition>
</template>

<style>
.roll-up-enter-active,
.roll-up-leave-active,
.roll-down-enter-active,
.roll-down-leave-active {
  transition:
    transform 0.4s ease-in,
    opacity 0.4s;
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
