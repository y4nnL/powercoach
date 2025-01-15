<script setup lang="ts">
import PSlideTransition from '@/components/transitions/PSlideTransition.vue'
import PFadeTransition from '@/components/transitions/PFadeTransition.vue'
import { useRefStore } from '@/stores/ref'
import { computed } from 'vue'

export type FullScreenModalProps = {
  dimBackdrop?: boolean
  offset?: number
  show: boolean
  snapToolbar?: boolean
}

const props = withDefaults(defineProps<FullScreenModalProps>(), {
  dimBackdrop: true,
  offset: 0,
  snapToolbar: false
})

const emits = defineEmits<{
  close: []
}>()

const toolbar = useRefStore().get('toolbar')
const offsetStart = computed<number>(
  () => (props.snapToolbar ? (toolbar.value?.clientHeight ?? 0) : 0) + props.offset
)
</script>

<template>
  <Teleport to="#modal">
    <PFadeTransition :appear="false">
      <div
        v-if="props.show"
        class="position-absolute top-0 left-0 w-100 h-100 modal-backdrop"
        :style="`--bs-backdrop-bg: rgba(0, 0, 0, ${props.dimBackdrop ? 0.5 : 0})`"
        @click="emits('close')"
      ></div>
    </PFadeTransition>
    <PSlideTransition :appear="false" :offset-start="offsetStart">
      <div
        v-if="props.show"
        class="position-absolute left-0 w-100 d-block bg-dark text-light modal"
        :style="{
          top: `${offsetStart}px`,
          height: `calc(100% - ${offsetStart}px)`
        }"
      >
        <slot></slot>
      </div>
    </PSlideTransition>
  </Teleport>
</template>

<style lang="scss" scoped>
.modal {
  box-shadow: 0 -0.5rem 1rem rgba(0, 0, 0, 0.7) !important;
}
</style>
