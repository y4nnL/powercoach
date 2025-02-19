<script setup lang="ts">
import PSlideTransition from '@/components/transitions/PSlideTransition.vue'
</script>

<template>
  <Teleport to="#bottom">
    <PSlideTransition :translation="1" :opacity="false">
      <slot></slot>
    </PSlideTransition>
  </Teleport>
</template>
