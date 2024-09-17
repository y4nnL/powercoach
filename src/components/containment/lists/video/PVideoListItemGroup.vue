<script setup lang="ts">
import { computed, ref } from 'vue'
import { type Video } from '@/types'
import PVideoListItem from '@/components/containment/lists/video/PVideoListItem.vue'
import vIntersect from '@/directives/PIntersect'

export type PVideoListItemProps = {
  preview?: number
  subtitle: string
  title: string
  videos: Video[]
}

const props = withDefaults(defineProps<PVideoListItemProps>(), { preview: 9 })

const visibilities = ref<Record<string, boolean>>({})

const previewedVideos = computed<Video[]>(() => props.videos.slice(0, props.preview))
const more = computed<number>(() => props.videos.length - props.preview)
</script>

<template>
  <div class="container-fluid position-relative">
    <div class="row">
      <PVideoListItem
        v-for="(video, index) in previewedVideos"
        class="col-4 col-md-2 gx-0"
        :key="video.id"
        :video="video"
        :visible="visibilities[video.id] ?? false"
        v-intersect="() => (visibilities[video.id] = true)"
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
        class="PVideoListItemGroupTitle position-absolute top-0 start-0 pt-2 w-100 h-100 bg-dark bg-gradient text-bg-dark"
        style="
          --bs-gradient: linear-gradient(0, rgba(0, 0, 0, 0) 40%, rgba(0, 0, 0, 0.6));
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
.PVideoListItemGroupTitle {
  padding-left: 1rem !important;
}
</style>
