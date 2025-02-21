<script setup lang="ts">
import PFadeTransition from '@/components/transitions/PFadeTransition.vue'

export type FullScreenModalProps = {
  show: boolean
}

const props = defineProps<FullScreenModalProps>()

const emits = defineEmits<{
  close: []
}>()
</script>

<template>
  <Teleport to="#modal">
    <PFadeTransition :appear="true">
      <div v-if="props.show" class="PModal-backdrop modal-backdrop" @click="emits('close')"></div>
    </PFadeTransition>
    <PFadeTransition :appear="true">
      <div v-if="props.show" class="PModal modal translate-middle rounded-4 shadow-lg">
        <slot></slot>
      </div>
    </PFadeTransition>
  </Teleport>
</template>

<style lang="scss" scoped>
.PModal {
  --bs-modal-zindex: 1065;
  top: 50% !important;
  left: 50% !important;
  width: auto !important;
  height: auto !important;
  display: flex !important;
}
.PModal-backdrop {
  --bs-backdrop-zindex: 1060;
  --bs-backdrop-bg: rgba(var(--bs-light-rgb), 0.5);
  backdrop-filter: blur(30px);
}
</style>
