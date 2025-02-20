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
  <div class="container-fluid">
    <div class="row gx-4 gy-1">
      <div class="col-12">
        <div
          class="container-fluid position-relative"
          style="--bs-box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.2)"
        >
          <div class="row rounded-4 overflow-hidden shadow">
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
                  class="card-img-overlay p-0 d-flex align-items-center justify-content-center rounded-0 bg-dark text-light"
                  style="--bs-bg-opacity: 0.85"
                >
                  <div class="d-flex flex-column">
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
              class="PVideoListGroupTitle position-absolute top-0 start-0 pt-2 w-100 bg-gradient rounded-4"
              style="
                --bs-gradient: linear-gradient(180deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0));
                --bs-bg-opacity: 0;
              "
            >
              <h5 class="card-title text-light">{{ props.title }}</h5>
              <h6 class="card-subtitle small text-light opacity-75">{{ props.subtitle }}</h6>
            </div>
          </div>
        </div>
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
