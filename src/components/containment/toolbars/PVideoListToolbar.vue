<script setup lang="ts">
import { ref, toRefs, watch } from 'vue'
import { useMainScroll } from '@/composables/useMainScroll'
import PSlideTransitionGroup from '@/components/transitions/PSlideTransitionGroup.vue'

export type PVideoListToolbarProps = {
  title?: string
  subtitle?: string
}

const props = defineProps<PVideoListToolbarProps>()

const { top: scrollingUp, bottom: scrollingDown } = toRefs(useMainScroll().directions)

const titles = ref<(string | undefined)[]>([props.title])

watch(
  () => props.title,
  (newTitle) => (titles.value = [newTitle])
)
</script>

<template>
  <nav class="navbar" :class="{ backdrop: Boolean(title), 'bg-transparent': !Boolean(title) }">
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

<style>
.backdrop {
  backdrop-filter: blur(50px);
}
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
