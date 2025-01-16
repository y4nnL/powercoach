<script setup lang="ts">
import { computed } from 'vue'

export type PSlideTransitionProps = {
  appear?: boolean
  axis?: 'x' | 'y'
  direction?: 'start' | 'end'
  offsetEnd?: number
  offsetStart?: number
  opacity?: boolean
  translation?: number
}

const DEFAULT_TRANSLATION = 0.1

const props = withDefaults(defineProps<PSlideTransitionProps>(), {
  appear: true,
  axis: 'y',
  direction: 'start',
  offsetEnd: 0,
  offsetStart: 0,
  opacity: true,
  translation: DEFAULT_TRANSLATION
})

const offsetStartVar = computed<string>(() => `${props.offsetStart}px`)
const translationPercentage = computed<string>(() => {
  const translation =
    props.translation >= 0 && props.translation <= 1 ? props.translation : DEFAULT_TRANSLATION
  return `${translation * 100}%`
})
const translationReversePercentage = computed<string>(() => `-${translationPercentage.value}`)
const opacityValue = computed<number>(() => (props.opacity ? 0 : 1))
</script>

<template>
  <Transition :appear="props.appear" :name="`slide-${props.axis}-${props.direction}`">
    <slot></slot>
  </Transition>
</template>

<style lang="scss" scoped>
.slide-x-start-enter-active,
.slide-x-start-leave-active,
.slide-x-end-enter-active,
.slide-x-end-leave-active,
.slide-y-start-enter-active,
.slide-y-start-leave-active,
.slide-y-end-enter-active,
.slide-y-end-leave-active {
  --p-slide-transition-translate: v-bind(translationPercentage);
  --p-slide-transition-translate-reverse: v-bind(translationReversePercentage);
  --p-slide-transition-opacity: v-bind(opacityValue);
  position: relative;
  transition:
    transform ease-out var(--p-transition-time),
    opacity linear var(--p-transition-time);
}

.slide-x-start-enter-from,
.slide-x-start-leave-to {
  transform: translateX(var(--p-slide-transition-translate));
  opacity: var(--p-slide-transition-opacity);
}

.slide-x-end-enter-from,
.slide-x-end-leave-to {
  transform: translateX(var(--p-slide-transition-translate-reverse));
  opacity: var(--p-slide-transition-opacity);
}

.slide-y-start-enter-from,
.slide-y-start-leave-to {
  transform: translateY(var(--p-slide-transition-translate));
  opacity: var(--p-slide-transition-opacity);
}
.slide-y-start-enter-to,
.slide-y-start-leave-from {
  top: v-bind(offsetStartVar) !important;
}

.slide-y-end-enter-from,
.slide-y-end-leave-to {
  transform: translateY(var(--p-slide-transition-translate-reverse));
  opacity: var(--p-slide-transition-opacity);
}
</style>
