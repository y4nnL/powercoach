<script setup lang="ts">
import { computed } from 'vue'
import { type Video } from '@/types'
import PVideoListItem from '@/components/containment/lists/video/PVideoListItem.vue'

export type PVideoListItemProps = {
  preview?: number
  subtitle: string
  title: string
  videos: Video[]
}

const props = withDefaults(defineProps<PVideoListItemProps>(), { preview: 9 })

const emit = defineEmits<{
  'click:video': [Video]
}>()

const previewedVideos = computed<Video[]>(() => props.videos.slice(0, props.preview))
const more = computed<number>(() => props.videos.length - props.preview)
</script>

<template>
  <div class="container-fluid position-relative">
    <div class="row">
      <PVideoListItem
        v-for="({ id, ...video }, index) in previewedVideos"
        class="col-4 col-md-2 gx-0"
        :id="id"
        :key="id"
        :video="{ id, ...video }"
        @click="(videoListItem) => emit('click:video', videoListItem)"
      >
        <template #overlay>
          <div
            v-if="more > 0 && index === previewedVideos.length - 1"
            class="card-img-overlay bg-dark text-bg-dark d-flex justify-content-center align-items-center display-2 rounded-0"
            style="--bs-bg-opacity: 0.9"
          >
            <span class="opacity-75">+{{ more }}</span>
          </div>
          <div v-else></div>
        </template>
      </PVideoListItem>
      <div
        class="PVideoListGroupTitle position-absolute top-0 start-0 pt-2 w-100 bg-dark bg-gradient text-bg-dark"
        style="
          --bs-gradient: linear-gradient(180deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0));
          --bs-bg-opacity: 0;
        "
      >
        <h5 class="card-title">{{ props.title }}</h5>
        <h6 class="card-subtitle text-dark-subtle small opacity-75">{{ props.subtitle }}</h6>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-title {
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
}
.card-subtitle {
  text-shadow: 0 3px 5px rgba(0, 0, 0, 0.5);
}
.PVideoListGroupTitle {
  padding-left: 1rem !important;
  pointer-events: none;
  height: 8rem;
}
</style>
