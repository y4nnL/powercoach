<script setup lang="ts">
import { computed } from 'vue'
import { type Video, type VideoTag, VideoTags } from '@/types'
import PVideoListItem from '@/components/containment/lists/video/PVideoListItem.vue'
import PVideoListGroupTag from '@/components/containment/lists/video/PVideoListGroupTag.vue'

const DEFAULT_PREVIEW = 9

export type PVideoListItemProps = {
  preview?: number
  subtitle: string
  title: string
  videos: Video[]
}

const props = withDefaults(defineProps<PVideoListItemProps>(), { preview: DEFAULT_PREVIEW })

const emit = defineEmits<{
  'click:video': [Video]
}>()

const previewedVideos = computed<Video[]>(() => props.videos.slice(0, props.preview))
const hiddenVideos = computed<Video[]>(() => props.videos.slice(props.preview))
const tags = computed<VideoTag[]>(
  () =>
    VideoTags.map((tag) =>
      props.videos.flatMap(({ tags }) => tags).includes(tag) ? tag : null
    ).filter(Boolean) as VideoTag[]
)
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
            v-if="hiddenVideos.length > 0 && index === previewedVideos.length - 1"
            class="card-img-overlay d-flex align-items-center justify-content-center bg-dark rounded-0"
            style="--bs-bg-opacity: 0.9"
          >
            <div class="text-bg-dark d-flex flex-column" style="--bs-bg-opacity: 0">
              <PVideoListGroupTag class="mb-1" :videos="props.videos"></PVideoListGroupTag>
              <PVideoListGroupTag
                v-for="tag in tags"
                :key="tag"
                :tag="tag"
                :videos="props.videos"
              ></PVideoListGroupTag>
            </div>
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
