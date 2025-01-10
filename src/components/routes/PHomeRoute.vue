<script setup lang="ts">
import PSlideTransition from '@/components/transitions/PSlideTransition.vue'
</script>

<template>
  <Teleport to="#bottom">
    <PSlideTransition>
      <div key="PHomeRoute_test" class="bg-danger text-light">ok</div>
    </PSlideTransition>
  </Teleport>
</template>
