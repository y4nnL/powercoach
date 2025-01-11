<script setup lang="ts">
import PFadeTransition from '@/components/transitions/PFadeTransition.vue'
import PIcon, { type PIconProps } from '@/components/icons/PIcon.vue'

type PToolbarButtonProps = {
  active?: boolean
  badge?: number
  icon: PIconProps['path']
}

const props = withDefaults(defineProps<PToolbarButtonProps>(), {
  active: false,
  badge: 0
})

const emit = defineEmits<{
  click: []
}>()
</script>

<template>
  <PFadeTransition>
    <div
      class="PToolbarButton rounded-pill d-flex justify-content-center align-items-center"
      :class="active ? 'bg-warning' : 'bg-light'"
      :style="{ '--bs-bg-opacity': active ? 0.5 : 0.15 }"
    >
      <PIcon key="icon" :path="props.icon" @click="emit('click')"></PIcon>
    </div>
  </PFadeTransition>
  <PFadeTransition>
    <span
      v-if="props.badge"
      class="badge rounded-pill bg-warning small position-absolute top-0 start-100 translate-middle"
    >
      {{ props.badge }}
    </span>
  </PFadeTransition>
</template>

<style lang="scss" scoped>
.PToolbarButton {
  transition: background-color 0.3s;
  width: 2.3rem;
  height: 2.3rem;
  backdrop-filter: blur(5px);
}
</style>
