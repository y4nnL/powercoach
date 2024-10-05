<script setup lang="ts">
import 'bootstrap'
import { ref, computed } from 'vue'
import PBottomNavigation from '@/components/navigation/PBottomNavigation.vue'
import { useRefStore } from '@/stores/ref'
import { useDebugStore } from '@/stores/debug'
import PIcon from '@/components/icons/PIcon.vue'

const main = ref<HTMLElement | null>(null)

const pBottomNavigation = ref<InstanceType<typeof PBottomNavigation>>()

const pBottomNavigationHeight = computed<number>(
  () => pBottomNavigation.value?.container?.clientHeight ?? 0
)

const { reticle } = useDebugStore()

useRefStore().set('main', main)
</script>

<template>
  <div class="vh-100 d-flex flex-column">
    <div ref="main" class="h-100 overflow-scroll">
      <RouterView />
    </div>
    <div
      id="fixed-bottom"
      class="fixed-bottom w-100"
      :style="{ bottom: `${pBottomNavigationHeight}px !important` }"
    ></div>
    <PBottomNavigation ref="pBottomNavigation" />
  </div>
  <PIcon
    v-if="reticle"
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
  --pc-area-top: env(safe-area-inset-top, 0px);
  --pc-area-right: env(safe-area-inset-right, 0px);
  --pc-area-bottom: env(safe-area-inset-bottom, 0px);
  --pc-area-left: env(safe-area-inset-left, 0px);
  --pc-title-font-family: 'Proelium';
}

body {
  --bs-body-bg: rgb(var(--bs-dark-rgb));
}

@import 'bootstrap/scss/bootstrap.scss';
</style>
