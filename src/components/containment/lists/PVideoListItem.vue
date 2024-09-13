<script setup lang="ts">
import { watch } from 'vue'
import { type Video } from '@/types'
import PIcon from '@/components/icons/PIcon.vue'
import PTagIcon from '@/components/icons/PTagIcon.vue'
import { useImageDataURLQuery } from '@/composables/useImageDataURLQuery'
import FadeOverTransition from '@/components/transitions/FadeOverTransition.vue'

export type PVideoListItemProps = {
  video: Video
  visible: boolean
}

const props = defineProps<PVideoListItemProps>()

const emit = defineEmits<{
  click: [Video]
}>()

const { data, isError, refetch } = useImageDataURLQuery(props.video.thumbnail)

watch<boolean>(
  () => props.visible,
  (visible) => visible && refetch()
)
</script>

<template>
  <div class="position-relative">
    <FadeOverTransition>
      <div
        v-if="props.visible && data"
        class="card ratio ratio-1x1 border border-0 rounded-0"
        key="thumbnail"
        @click="emit('click', props.video)"
      >
        <img :src="data" />
        <slot name="overlay">
          <div class="card-img-overlay d-flex align-items-end m-0 p-0">
            <div class="w-100 bg-dark text-bg-dark d-flex gap-1 p-1" style="--bs-bg-opacity: 0.3">
              <PTagIcon v-for="tag in video.tags" :key="tag" :tag="tag" :size="14" />
            </div>
          </div>
        </slot>
      </div>
      <div v-else class="ratio ratio-1x1" key="placeholder">
        <div class="d-flex justify-content-center align-items-center bg-body-tertiary">
          <PIcon
            :path="isError ? 'mdiVideoOff' : 'mdiVideo'"
            :class="{
              'text-secondary': !isError,
              'text-danger': isError
            }"
          />
        </div>
      </div>
    </FadeOverTransition>
  </div>
</template>
