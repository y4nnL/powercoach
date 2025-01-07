<script setup lang="ts">
import 'bootstrap'
import { ref } from 'vue'
import { useResizeObserver } from '@vueuse/core'
import PBottomNavigation from '@/components/navigation/PBottomNavigation.vue'
import { useRefStore } from '@/stores/ref'
import { useDebugStore } from '@/stores/debug'
import PIcon from '@/components/icons/PIcon.vue'

const main = ref<HTMLElement | null>(null)
const fixedBottom = ref<HTMLElement | null>(null)
const fixedBottomBottom = ref<number>(0)
const pBottomNavigation = ref<InstanceType<typeof PBottomNavigation>>()

const { reticule } = useDebugStore()

useRefStore().set('main', main)
useRefStore().set('fixedBottom', fixedBottom)

useResizeObserver(pBottomNavigation, ([{ contentRect }]) => {
  fixedBottomBottom.value = contentRect.bottom
})
</script>

<template>
  <div class="vh-100 d-flex flex-column">
    <div ref="main" class="h-100 overflow-scroll">
      <RouterView />
    </div>
    <div
      ref="fixedBottom"
      id="fixed-bottom"
      class="fixed-bottom w-100"
      :style="{ bottom: `${fixedBottomBottom}px !important` }"
    ></div>
    <PBottomNavigation ref="pBottomNavigation" />
  </div>
  <PIcon
    v-if="reticule"
    :path="'mdiPlus'"
    class="position-absolute translate-middle text-danger start-50 top-50"
    style="z-index: 1000000"
  ></PIcon>
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

@import 'bootstrap/scss/bootstrap.scss';
</style>
