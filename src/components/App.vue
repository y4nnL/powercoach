<script setup lang="ts">
import PBottomNavigation from '@/components/navigation/PBottomNavigation.vue'
</script>

<template>
  <div class="vh-100 d-flex flex-column">
    <div class="h-100 overflow-scroll">
      <RouterView />
    </div>
    <PBottomNavigation />
  </div>
</template>
