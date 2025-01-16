<script setup lang="ts">
export type PFadeTransitionProps = {
  appear?: boolean
}

const props = withDefaults(defineProps<PFadeTransitionProps>(), {
  appear: true
})
</script>

<template>
  <Transition :appear="props.appear" name="fade">
    <slot></slot>
  </Transition>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity linear var(--p-transition-time);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
