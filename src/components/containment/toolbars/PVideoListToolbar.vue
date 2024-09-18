<script setup lang="ts">
import { ref, toRefs, watch } from 'vue'
import { throttle } from 'lodash'
import PSlideTransitionGroup from '@/components/transitions/PSlideTransitionGroup.vue'
import { useMainScroll } from '@/composables/useMainScroll'
import { useRefStore } from '@/stores/ref'

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
  <nav class="navbar navbar-dark bg-dark overflow-hidden" ref="container">
    <div class="container-fluid">
      <a class="navbar-brand position-relative" href="#">
        &nbsp;
        <PSlideTransitionGroup
          :direction="scrollingUp ? 'up' : scrollingDown ? 'down' : undefined"
          @end="titles = [props.title]"
        >
          <span
            v-for="title in titles"
            :key="title"
            class="position-absolute"
            :class="{ subtitle: Boolean(subtitle) }"
          >
            {{ title }}
            <span class="d-block small" v-if="subtitle">{{ subtitle }}</span>
          </span>
        </PSlideTransitionGroup>
      </a>
    </div>
  </nav>
</template>

<style scoped>
.subtitle {
  position: relative;
  top: -0.2rem;
}
.subtitle .small {
  position: relative;
  top: -0.3rem;
  font-size: 70%;
}
</style>
