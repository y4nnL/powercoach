<script setup lang="ts">
import { computed, ref } from 'vue'
import { useResizeObserver } from '@vueuse/core'
import { useRefStore } from '@/stores/ref'
import { Scale, type Video } from '@/types'
import { useHumanReadability } from '@/composables/useHumanReadability'
import PRollTransition from '@/components/transitions/PRollTransition.vue'
import PVideoListToolbarDivider from '@/components/containment/toolbars/PVideoListToolbarDivider.vue'
import PToolbarButton from '@/components/containment/buttons/PToolbarButton.vue'

export type PVideoListToolbarProps = {
  activateFilters?: boolean
  filters?: number
  scale: Scale
  throttle?: number
  video?: Video
}

const props = withDefaults(defineProps<PVideoListToolbarProps>(), { throttle: 500 })

const emit = defineEmits<{
  'click:filters': []
}>()

const blockPlaceholder = ref<HTMLElement | null>(null)
const blockWidth = ref<number>()
const weekPlaceholder = ref<HTMLElement | null>(null)
const weekWidth = ref<number>()
const container = ref<HTMLElement | null>(null)

const { blockName, weekName, workoutName, videoDate } = useHumanReadability()

const block = computed<string | undefined>(() =>
  props.video && props.scale !== Scale.Block ? blockName(props.video.block) : undefined
)
const week = computed<string | undefined>(() =>
  props.video && [Scale.Workout, Scale.All].includes(props.scale)
    ? weekName(props.video.week)
    : undefined
)
const workout = computed<string | undefined>(() =>
  props.video && props.scale === Scale.All ? workoutName(props.video.workout) : undefined
)
const date = computed<string | undefined>(() =>
  props.video && props.scale === Scale.All ? videoDate(props.video) : undefined
)
const isBlockShown = computed<boolean>(() => props.scale !== Scale.Block)
const isWeekShown = computed<boolean>(() => isBlockShown.value && Boolean(week.value))
const isWorkoutShown = computed<boolean>(() => isWeekShown.value && Boolean(workout.value))
const isDateShown = computed<boolean>(() => isWorkoutShown.value && Boolean(date.value))
const isShown = computed<boolean>(() => isBlockShown.value)
const readableBlock = computed<string>((previousValue) => {
  return block.value ?? previousValue ?? ''
})
const readableWeek = computed<string>((previousValue) => {
  return week.value ?? previousValue ?? ''
})
const readableWorkout = computed<string>((previousValue) => {
  return workout.value ?? previousValue ?? ''
})
const readableDate = computed<string>((previousValue) => {
  return date.value ?? previousValue ?? ''
})

useResizeObserver(blockPlaceholder, ([{ contentRect }]) => {
  blockWidth.value = contentRect.width
})
useResizeObserver(weekPlaceholder, ([{ contentRect }]) => {
  weekWidth.value = contentRect.width
})
useRefStore().set('toolbar', container)
</script>

<template>
  <nav class="navbar bg-transparent" ref="container">
    <div class="navbar-brand position-absolute top-0 start-0 opacity-0 z-1">
      <div ref="blockPlaceholder" class="d-inline-flex align-items-center">
        <span>{{ readableBlock || blockName({ index: 1 }) }}</span>
        <PVideoListToolbarDivider />
      </div>
      <div ref="weekPlaceholder" class="d-inline-flex align-items-center">
        <span>{{ readableWeek || weekName({ index: 1 }) }}</span>
        <PVideoListToolbarDivider />
      </div>
    </div>
    <div class="position-absolute top-0 start-0 w-100 h-100 bg-gradient z-2"></div>
    <div class="d-flex justify-content-between position-relative z-3 w-100 ps-3">
      <a
        class="navbar-brand visibility d-flex flex-wrap text-light"
        :class="{ upper: isDateShown, show: isShown }"
      >
        <div class="visibility" :class="{ show: isBlockShown }">
          <PRollTransition>
            <span class="position-absolute d-inline-flex align-items-center" :key="readableBlock">
              <span>{{ readableBlock }}</span>
              <PVideoListToolbarDivider class="visibility" :class="{ show: isWeekShown }" />
            </span>
          </PRollTransition>
          <span class="opacity-0 d-inline-block width" :style="{ width: `${blockWidth}px` }"></span>
        </div>
        <div class="visibility" :class="{ show: isWeekShown }">
          <PRollTransition>
            <span class="position-absolute d-inline-flex align-items-center" :key="readableWeek">
              <span>{{ readableWeek }}</span>
              <PVideoListToolbarDivider class="visibility" :class="{ show: isWorkoutShown }" />
            </span>
          </PRollTransition>
          <span class="opacity-0 d-inline-block width" :style="{ width: `${weekWidth}px` }"></span>
        </div>
        <div class="visibility" :class="{ show: isWorkoutShown }">
          <PRollTransition>
            <span class="position-absolute" :key="readableWorkout">{{ readableWorkout }}</span>
          </PRollTransition>
          <span class="opacity-0">{{ readableWorkout }}</span>
        </div>
        <span>&nbsp;</span>
        <div class="visibility small w-100" :class="{ show: isDateShown }">
          <span class="position-absolute date">{{ readableDate }}</span>
        </div>
      </a>
      <div class="d-flex text-light pe-3">
        <div class="position-relative visibility show">
          <PToolbarButton
            icon="mdiTuneVariant"
            :active="activateFilters"
            :badge="0"
            @click="() => emit('click:filters')"
          ></PToolbarButton>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped lang="scss">
.navbar {
  padding-top: calc(max(var(--p-area-top), var(--bs-navbar-padding-y)) + 1rem) !important;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.8);
}
.navbar-brand {
  font-family: var(--p-title-font-family), sans-serif;
  .small {
    font-family: var(--bs-body-font-family), sans-serif;
  }
}
.date {
  transform: translateY(-10%);
}
.visibility {
  transition: opacity 0.3s linear;
  opacity: 0;
  &.show {
    opacity: 1;
  }
}
.visibility.navbar-brand {
  transition:
    transform 0.3s ease-in-out,
    opacity 0.3s linear;
  &.upper {
    transform: translateY(-40%);
  }
}
.bg-gradient {
  pointer-events: none;
  backdrop-filter: blur(3px);
  mask-image: linear-gradient(to bottom, black 50%, transparent);
  --bs-gradient: linear-gradient(
    to bottom,
    rgba(var(--bs-dark-rgb), 1),
    rgba(var(--bs-dark-rgb), 0)
  );
}
.width {
  transition: width 0.5s ease-in-out;
}
</style>
