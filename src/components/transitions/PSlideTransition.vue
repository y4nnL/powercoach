<script setup lang="ts">
export type PSlideTransitionProps = {
  axis?: 'x' | 'y'
  direction?: 'start' | 'end'
}

const props = withDefaults(defineProps<PSlideTransitionProps>(), {
  axis: 'y',
  direction: 'start'
})
</script>

<template>
  <Transition :appear="true" :name="`slide-${props.axis}-${props.direction}`">
    <slot></slot>
  </Transition>
</template>

<style>
.slide-y-start-enter-active,
.slide-y-start-leave-active {
  transition: transform ease-out 0.3s;
}
.slide-y-start-enter-from,
.slide-y-start-leave-to {
  transform: translateY(100%);
}
</style>
