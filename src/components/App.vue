<script setup lang="ts">
import 'bootstrap'
import { ref } from 'vue'
import { useRefStore } from '@/stores/ref'
import { useDebugStore } from '@/stores/debug'
import { useMutationObserver } from '@vueuse/core'
import PBottomNavigation from '@/components/navigation/PBottomNavigation.vue'
import PIcon from '@/components/icons/PIcon.vue'

const main = ref<HTMLElement | null>(null)
const modal = ref<HTMLElement | null>(null)

const { reticule } = useDebugStore()

const hasModal = ref<boolean>(false)

useRefStore().set('main', main)

useMutationObserver(
  modal,
  (entries) => {
    hasModal.value = entries
      .flatMap(({ addedNodes }) => [...addedNodes].some((node) => node.nodeType === 1))
      .some(Boolean)
  },
  { childList: true }
)
</script>

<template>
  <div class="h-100 d-flex flex-column">
    <div
      id="main"
      ref="main"
      class="h-100 overflow-x-hidden"
      :class="{
        hasModal,
        'overflow-y-scroll': !hasModal,
        'overflow-y-hidden': hasModal
      }"
    >
      <RouterView />
    </div>
    <div class="w-100 d-flex flex-column">
      <div id="bottom" class="position-relative z-1"></div>
      <PBottomNavigation class="position-relative z-2" />
    </div>
  </div>
  <PIcon
    v-if="reticule"
    :path="'mdiPlus'"
    class="position-absolute translate-middle text-danger start-50 top-50"
    style="z-index: 1000000"
  ></PIcon>
  <div id="modal" ref="modal"></div>
</template>

<style lang="scss">
$blue: #dbc078;
$dark: #1c1c1c;

@font-face {
  font-family: 'Proelium';
  src:
    local('Proelium'),
    url('@/assets/fonts/Proelium.otf') format('opentype');
}

:root {
  --p-area-top: env(safe-area-inset-top, 0px);
  --p-area-right: env(safe-area-inset-right, 0px);
  --p-area-bottom: env(safe-area-inset-bottom, 0px);
  --p-area-left: env(safe-area-inset-left, 0px);
  --p-title-font-family: 'Proelium';
}

body {
  --bs-body-bg: rgb(var(--bs-dark-rgb));
}

#main {
  transition: transform ease-out 0.3s;
  &.hasModal {
    transform: scale(0.97);
  }
}

@import 'bootstrap/scss/bootstrap.scss';
</style>
