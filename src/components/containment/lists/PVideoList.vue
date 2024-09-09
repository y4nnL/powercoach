<script setup lang="ts">
import { ref } from 'vue'
import type { Video } from '@/types'
import PVideoListItem from '@/components/containment/lists/PVideoListItem.vue'
import vIntersect from '@/directives/PIntersect'

export type PVideoListProps = {
  videos: Video[]
}

const props = defineProps<PVideoListProps>()

const visibilities = ref<Record<number, boolean>>({})
</script>

<template>
  <div class="container-fluid">
    <div class="row gy-0">
      <PVideoListItem
        v-for="(video, index) in props.videos"
        class="p-video-list-item col-4 col-md-2 gx-0"
        :key="video.id"
        :video="video"
        :visible="visibilities[index] ?? false"
        v-intersect="() => (visibilities[index] = true)"
      />
    </div>
  </div>
  <RouterView />
</template>
