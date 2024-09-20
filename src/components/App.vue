<script setup lang="ts">
import { ref, computed } from 'vue'
import PBottomNavigation from '@/components/navigation/PBottomNavigation.vue'
import { useRefStore } from '@/stores/ref'

const main = ref<HTMLElement | null>(null)

const pBottomNavigation = ref<InstanceType<typeof PBottomNavigation>>()

const pBottomNavigationHeight = computed<number>(
  () => pBottomNavigation.value?.container?.clientHeight ?? 0
)

useRefStore().set('main', main)
</script>

<template>
  <div class="vh-100 d-flex flex-column bg-dark" style="--bs-dark-rgb: 13, 17, 21">
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
</template>
