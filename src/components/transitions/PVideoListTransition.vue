<script setup lang="ts">
import anime from 'animejs'
import { Scale } from '@/types'
import { ref, watch, watchEffect } from 'vue'

export type PVideoListTransitionProps = {
  anchors?: { [scale in Scale]?: string }
  offsetTop: number
  scale: Scale
}

const DURATION = 300
const DELAY = DURATION / 2
const SCALE = 0.2

const props = defineProps<PVideoListTransitionProps>()

const emit = defineEmits<{
  complete: [scrollTop: number]
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

const enter = ref<{ el: HTMLElement; done: () => void }>()
const leave = ref<{ el: HTMLElement; done: () => void }>()

function startIn() {
  const leaveDOMRect = leave.value!.el.getBoundingClientRect()
  const leaveTransformOrigin = `50% ${window.innerHeight / 2 - leaveDOMRect.top}px`

  let enterTop = -(leaveDOMRect.height + leaveDOMRect.top - props.offsetTop)
  let enterTransformOrigin = `50% ${window.innerHeight / 2}px`

  let anchorOffset = 0
  const anchor = props.anchors?.[props.scale]
    ? (enter.value!.el.querySelector(`[id="${props.anchors[props.scale]}"]`) as HTMLElement)
    : null

  if (anchor) {
    anchorOffset = anchor.getBoundingClientRect().top - enter.value!.el.getBoundingClientRect().top
    enterTop -= anchorOffset
    enterTransformOrigin = `50% ${window.innerHeight / 2 + anchorOffset}px`
  }

  Promise.all([
    // enter opacity animation
    anime({
      targets: enter.value!.el,
      opacity: [0, 1],
      duration: DURATION,
      easing: 'linear',
      delay: DELAY
    }).finished,

    // enter scale animation
    anime({
      targets: enter.value!.el,
      scale: [1 - SCALE, 1],
      top: [enterTop, enterTop],
      transformOrigin: [enterTransformOrigin, enterTransformOrigin],
      duration: DURATION,
      easing: 'easeOutQuad',
      delay: DELAY
    }).finished,

    // leave opacity animation
    anime({
      targets: leave.value!.el,
      opacity: 0,
      duration: DURATION,
      easing: 'linear'
    }).finished,

    // leave scale animation
    anime({
      targets: leave.value!.el,
      scale: 1 + SCALE,
      transformOrigin: [leaveTransformOrigin, leaveTransformOrigin],
      duration: DURATION,
      easing: 'easeInQuad'
    }).finished
  ]).finally(() => {
    emit('complete', anchorOffset)
    leave.value!.el.removeAttribute('style')
    enter.value!.el.removeAttribute('style')
    enter.value!.done()
    leave.value!.done()
    enter.value = undefined
    leave.value = undefined
  })
}

function startOut() {
  const leaveDOMRect = leave.value!.el.getBoundingClientRect()
  const leaveTransformOrigin = `50% ${window.innerHeight / 2 - leaveDOMRect.top}px`

  let enterTop = -(leaveDOMRect.height + leaveDOMRect.top - props.offsetTop)
  let enterTransformOrigin = `50% ${window.innerHeight / 2}px`

  let anchorOffset = 0
  const anchor = props.anchors?.[props.scale]
    ? (enter.value!.el.querySelector(`[id="${props.anchors[props.scale]}"]`) as HTMLElement)
    : null

  if (anchor) {
    anchorOffset = anchor.getBoundingClientRect().top - enter.value!.el.getBoundingClientRect().top
    enterTop -= anchorOffset
    enterTransformOrigin = `50% ${window.innerHeight / 2 + anchorOffset}px`
  }

  Promise.all([
    // enter opacity animation
    anime({
      targets: enter.value!.el,
      opacity: [0, 1],
      duration: DURATION,
      easing: 'linear',
      delay: DELAY
    }).finished,

    // enter scale animation
    anime({
      targets: enter.value!.el,
      scale: [1.3, 1],
      top: [enterTop, enterTop],
      transformOrigin: [enterTransformOrigin, enterTransformOrigin],
      duration: DURATION,
      easing: 'easeOutQuad',
      delay: DELAY
    }).finished,

    // leave opacity animation
    anime({
      targets: leave.value!.el,
      opacity: 0,
      duration: DURATION,
      easing: 'linear'
    }).finished,

    // leave scale animation
    anime({
      targets: leave.value!.el,
      scale: 0.7,
      transformOrigin: [leaveTransformOrigin, leaveTransformOrigin],
      duration: DURATION,
      easing: 'easeInQuad'
    }).finished
  ]).finally(() => {
    emit('complete', anchorOffset)
    leave.value!.el.removeAttribute('style')
    enter.value!.el.removeAttribute('style')
    enter.value!.done()
    leave.value!.done()
    enter.value = undefined
    leave.value = undefined
  })
}

watchEffect(() => {
  if (enter.value && leave.value) {
    direction.value === 'in' && startIn()
    direction.value === 'out' && startOut()
  }
})

// function enter(el: HTMLElement) {
//   if (direction.value === 'out') {
//     const anchorDOMRect = el.querySelector(`[id="${props.anchors?.out}"]`)?.getBoundingClientRect()
//     const anchorDOMRectTop = anchorDOMRect ? anchorDOMRect.top - leavingDOMRect.height : 0
//     console.log(anchorDOMRectTop)
//     el.style.top = `-${leavingDOMRect.height + leavingDOMRect.top + anchorDOMRectTop - props.offsetTop}px`
//     el.style.transformOrigin = `50% ${window.innerHeight / 2}px`
//   }
// }

// function leave(el: HTMLElement) {
//   console.log(props.anchors)
//   if (direction.value === 'out') {
//     leavingDOMRect = el.getBoundingClientRect()
//     el.style.transformOrigin = `50% ${window.innerHeight / 2 - leavingDOMRect.top}px`
//   }
// }

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
