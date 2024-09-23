<script setup lang="ts">
import { ref, toRefs, watch } from 'vue'
import { throttle } from 'lodash'
import PSlideTransitionGroup from '@/components/transitions/PSlideTransitionGroup.vue'
import { useMainScroll } from '@/composables/useMainScroll'
import { useRefStore } from '@/stores/ref'
import PIcon from '@/components/icons/PIcon.vue'

export type PVideoListToolbarProps = {
  title?: string
  subtitle?: string
}

const TRANSITION_THROTTLE = 500

const props = defineProps<PVideoListToolbarProps>()

const { top: scrollingUp, bottom: scrollingDown } = toRefs(useMainScroll().directions)

const titles = ref<(string | undefined)[]>([props.title])

const container = ref<HTMLElement | null>(null)

watch(
  () => props.title,
  throttle((newTitle) => (titles.value = [newTitle]), TRANSITION_THROTTLE)
)

useRefStore().set('toolbar', container)
</script>

<template>
  <nav class="PVideoListToolbar navbar navbar-dark bg-dark bg-transparent" ref="container">
    <div
      class="PVideoListToolbar-bg position-absolute top-0 start-0 w-100 h-100 bg-gradient z-1"
    ></div>
    <div class="container-fluid">
      <a class="navbar-brand position-relative z-2">
        &nbsp;
        <PSlideTransitionGroup
          :direction="scrollingUp ? 'up' : scrollingDown ? 'down' : undefined"
          @end="titles = [props.title]"
        >
          <span
            v-for="title in titles"
            :key="title + (subtitle ?? '')"
            class="position-absolute d-inline-flex align-items-center"
          >
            {{ title }}
            <PIcon v-if="subtitle" class="opacity-25" :size="24" :path="'mdiChevronRight'"></PIcon>
            <span v-if="subtitle">{{ subtitle }}</span>
          </span>
        </PSlideTransitionGroup>
      </a>
    </div>
  </nav>
</template>

<style scoped lang="scss">
.PVideoListToolbar {
  padding-top: var(--safe-area-top);
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.8);

  .PVideoListToolbar-bg {
    pointer-events: none;
    --bs-gradient: linear-gradient(
      180deg,
      rgba(var(--bs-dark-rgb), 0.8),
      rgba(var(--bs-dark-rgb), 0)
    );
  }
}
</style>
