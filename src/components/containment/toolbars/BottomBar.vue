<script setup lang="ts">
import PSlideTransition from '@/components/transitions/PSlideTransition.vue'
</script>

<template>
  <Teleport to="#bottom">
    <PSlideTransition>
      <slot></slot>
    </PSlideTransition>
  </Teleport>
</template>
