<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { type Video } from '@/types'
import PIcon from '@/components/icons/PIcon.vue'
import PTagIcon from '@/components/icons/PTagIcon.vue'
import { useImageDataURLQuery } from '@/composables/useImageDataURLQuery'
import PFadeOverTransition from '@/components/transitions/PFadeOverTransition.vue'
import vIntersect from '@/directives/PIntersect'

export type PVideoListItemProps = {
  video: Video
}

const props = defineProps<PVideoListItemProps>()

const emit = defineEmits<{
  click: [Video]
}>()

const visible = ref<boolean>(false)

const { data, isError, refetch } = useImageDataURLQuery(props.video.thumbnail)

const cached = computed<boolean>(() => Boolean(data.value))

if (!cached.value) {
  const unwatch = watch<boolean>(visible, (is) => {
    if (is) {
      refetch()
      unwatch()
    }
  })
}
</script>

<template>
  <div class="position-relative">
    <PFadeOverTransition>
      <div
        v-if="cached || (visible && data)"
        class="card ratio ratio-1x1 border border-0 rounded-0"
        key="thumbnail"
        @click="emit('click', props.video)"
      >
        <img :src="data" class="bg-dark" />
        <slot name="overlay">
          <div class="card-img-overlay d-flex align-items-end m-0 p-0">
            <div class="w-100 bg-dark text-bg-dark d-flex gap-1 p-1" style="--bs-bg-opacity: 0.3">
              <PTagIcon v-for="tag in video.tags" :key="tag" :tag="tag" :size="14" />
            </div>
          </div>
        </slot>
      </div>
      <div v-else class="ratio ratio-1x1 bg-dark" key="placeholder">
        <div
          class="d-flex justify-content-center align-items-center bg-dark"
          style="--bs-dark-rgb: 53, 57, 61"
          v-intersect.delay.visible.once="{ on: (is: boolean) => (visible = is) }"
        >
          <PIcon
            :path="isError ? 'mdiVideoOff' : 'mdiVideo'"
            :class="{
              'text-secondary opacity-25': !isError,
              'text-danger': isError
            }"
          />
        </div>
      </div>
    </PFadeOverTransition>
  </div>
</template>
