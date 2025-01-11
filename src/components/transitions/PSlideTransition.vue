<script setup lang="ts">
import { computed } from 'vue'

export type PSlideTransitionProps = {
  appear?: boolean
  axis?: 'x' | 'y'
  direction?: 'start' | 'end'
  offsetEnd?: number
  offsetStart?: number
}

const props = withDefaults(defineProps<PSlideTransitionProps>(), {
  appear: true,
  axis: 'y',
  direction: 'start',
  offsetEnd: 0,
  offsetStart: 0
})

const offsetStartVar = computed<string>(() => `${props.offsetStart}px`)
</script>

<template>
  <Transition :appear="props.appear" :name="`slide-${props.axis}-${props.direction}`">
    <slot></slot>
  </Transition>
</template>

<style>
.slide-x-start-enter-active,
.slide-x-start-leave-active,
.slide-x-end-enter-active,
.slide-x-end-leave-active,
.slide-y-start-enter-active,
.slide-y-start-leave-active,
.slide-y-end-enter-active,
.slide-y-end-leave-active {
  transition: transform ease-out 0.3s;
}

.slide-x-start-enter-from,
.slide-x-start-leave-to {
  transform: translateX(100%);
}

.slide-x-end-enter-from,
.slide-x-end-leave-to {
  transform: translateX(-100%);
}

.slide-y-start-enter-from,
.slide-y-start-leave-to {
  transform: translateY(100%);
}
.slide-y-start-enter-to,
.slide-y-start-leave-from {
  top: v-bind(offsetStartVar) !important;
}

.slide-y-end-enter-from,
.slide-y-end-leave-to {
  transform: translateY(-100%);
}
</style>
