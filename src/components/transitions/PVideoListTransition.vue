<script setup lang="ts">
import { nextTick, ref, watch, watchEffect } from 'vue'
import anime from 'animejs'
import { debounce } from 'lodash'
import { Scale } from '@/types'
import { useRefStore } from '@/stores/ref'
import { usePointerEvents } from '@/composables/usePointerEvents'

export type PVideoListTransitionProps = {
  anchors?: { [scale in Scale]?: string }
  offsetBottom?: number
  offsetTop?: number
  scale: Scale
}

const DURATION = 250
const DELAY = DURATION / 2
const SCALE = 0.2

const props = withDefaults(defineProps<PVideoListTransitionProps>(), {
  offsetBottom: 0,
  offsetTop: 0
})

const emit = defineEmits<{
  complete: [scrollY: number]
  progress: []
}>()

const direction = ref<'in' | 'out'>('out')

const scaleLevel = {
  [Scale.All]: 1,
  [Scale.Set]: 2,
  [Scale.Exercise]: 3,
  [Scale.Workout]: 4,
  [Scale.Week]: 5,
  [Scale.Block]: 6
}

const appear = ref<boolean>(true)

const enter = ref<{ el: HTMLElement; done: () => void }>()
const leave = ref<{ el: HTMLElement; done: () => void }>()

const main = useRefStore().get('main')

function transition() {
  usePointerEvents(false)

  const { innerHeight: viewportHeight } = window
  const mainHeight = main.value!.getBoundingClientRect().height

  const leaveDOMRect = leave.value!.el.getBoundingClientRect()
  const leaveTransformOrigin = `50% ${viewportHeight / 2 - leaveDOMRect.top}px`

  let enterTop = -(leaveDOMRect.height + leaveDOMRect.top - props.offsetTop)
  let enterTransformOrigin = `50% ${viewportHeight / 2}px`

  let anchorOffset = 0
  const anchor = props.anchors?.[props.scale]
    ? (enter.value!.el.querySelector(`[id="${props.anchors[props.scale]}"]`) as HTMLElement)
    : null

  if (anchor) {
    const enterDOMRect = enter.value!.el.getBoundingClientRect()
    anchorOffset = anchor.getBoundingClientRect().top - enterDOMRect.top + 1
    const enterOffsetHeight =
      enterDOMRect.height + props.offsetTop + props.offsetBottom - anchorOffset
    if (enterOffsetHeight < mainHeight) {
      anchorOffset -= mainHeight - enterOffsetHeight
    }
    enterTop -= anchorOffset
    enterTransformOrigin = `50% ${viewportHeight / 2 + anchorOffset}px`
  }

  const update = debounce(() => {
    emit('progress')
  }, 10)

  Promise.all([
    // enter opacity animation
    anime({
      targets: enter.value!.el,
      opacity: [0, 1],
      duration: DURATION,
      easing: 'linear',
      delay: DELAY,
      update
    }).finished,

    // enter scale animation
    anime({
      targets: enter.value!.el,
      scale: [1 + SCALE * (direction.value === 'in' ? -1 : 1), 1],
      top: [enterTop, enterTop],
      transformOrigin: [enterTransformOrigin, enterTransformOrigin],
      duration: DURATION,
      easing: 'easeOutQuad',
      delay: DELAY,
      update
    }).finished,

    // leave opacity animation
    anime({
      targets: leave.value!.el,
      opacity: 0,
      duration: DURATION,
      easing: 'linear',
      update
    }).finished,

    // leave scale animation
    anime({
      targets: leave.value!.el,
      scale: 1 + SCALE * (direction.value === 'in' ? 1 : -1),
      transformOrigin: [leaveTransformOrigin, leaveTransformOrigin],
      duration: DURATION,
      easing: 'easeInQuad',
      update
    }).finished
  ]).finally(() => {
    leave.value!.el.removeAttribute('style')
    enter.value!.el.removeAttribute('style')
    enter.value!.done()
    leave.value!.done()
    enter.value = undefined
    leave.value = undefined
    nextTick(() => {
      usePointerEvents(true)
      emit('complete', anchorOffset)
    })
  })
}

function transitionAppear() {
  usePointerEvents(false)

  let transformOrigin = `50% ${window.innerHeight / 2}px`

  Promise.all([
    // enter opacity animation
    anime({
      targets: enter.value!.el,
      opacity: [0, 1],
      duration: DURATION * 2,
      easing: 'linear',
      delay: DELAY
    }).finished,

    // enter scale animation
    anime({
      targets: enter.value!.el,
      scale: [1 + SCALE * (direction.value === 'in' ? 1 : -1), 1],
      transformOrigin: [transformOrigin, transformOrigin],
      duration: DURATION * 2,
      easing: 'easeOutQuad',
      delay: DELAY
    }).finished
  ]).finally(() => {
    enter.value!.el.removeAttribute('style')
    enter.value!.done()
    enter.value = undefined
    nextTick(() => {
      usePointerEvents(true)
      emit('complete', 0)
    })
  })
}

watchEffect(() => {
  if (!main.value) {
    return
  }
  if (enter.value && leave.value) {
    transition()
  } else if (enter.value && appear.value) {
    transitionAppear()
    appear.value = false
  }
})

watch(
  () => props.scale,
  (newScale, oldScale) => {
    direction.value = scaleLevel[newScale] > scaleLevel[oldScale] ? 'out' : 'in'
  }
)
</script>

<template>
  <transition
    :name="`scale-${direction}`"
    @enter="(el, done) => (enter = { el: el as HTMLElement, done })"
    @leave="(el, done) => (leave = { el: el as HTMLElement, done })"
    :appear="true"
  >
    <slot></slot>
  </transition>
</template>

<style>
.scale-out-enter-active,
.scale-out-leave-active,
.scale-in-enter-active,
.scale-in-leave-active {
  position: relative;
}
.scale-in-leave-active,
.scale-out-leave-active {
  z-index: 1;
}
.scale-in-enter-active,
.scale-out-enter-active {
  z-index: 2;
}
</style>
