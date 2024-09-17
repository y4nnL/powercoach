<script setup lang="ts">
export type PSlideTransitionGroupProps = {
  direction?: 'up' | 'down'
}

const props = defineProps<PSlideTransitionGroupProps>()

const emit = defineEmits<{
  end: []
}>()
</script>

<template>
  <transition-group :name="`slide-${props.direction ?? 'none'}`" @after-enter="emit('end')">
    <slot></slot>
  </transition-group>
</template>

<style>
.slide-up-enter-active,
.slide-up-leave-active,
.slide-down-enter-active,
.slide-down-leave-active {
  transition:
    transform 0.4s ease-out,
    opacity 0.4s;
}
.slide-up-enter-from,
.slide-down-leave-to {
  transform: translateY(-40%);
  opacity: 0;
}
.slide-up-leave-to,
.slide-down-enter-from {
  transform: translateY(40%);
  opacity: 0;
}

.slide-none-enter-active,
.slide-none-leave-active {
  transition: opacity 0.4s;
}
.slide-none-enter-from,
.slide-none-leave-to {
  opacity: 0;
}
</style>
