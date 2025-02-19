<script setup lang="ts">
import { computed, ref } from 'vue'
import { Scale, type Video, type VideoControl } from '@/types'
import { useVideosQuery } from '@/composables/useVideosQuery'
import { useQueryHooks } from '@/composables/useQueryHooks'
import PVideoList from '@/components/containment/lists/video/PVideoList.vue'
import PVideoListToolbar, {
  type PVideoListToolbarAction
} from '@/components/containment/toolbars/PVideoListToolbar.vue'
import PLoader from '@/components/containment/loaders/PLoader.vue'
import PScaleButtonGroup from '@/components/containment/buttons/PScaleButtonGroup.vue'
import PBottomBar from '@/components/containment/toolbars/PBottomBar.vue'
import PFullScreenModal from '@/components/containment/modals/PFullScreenModal.vue'
import PVideoListControls from '@/components/controls/PVideoListControls.vue'

const scale = ref<Scale>(Scale.All)
const video = ref<Video>()
const showControls = ref<boolean>(false)
const videos = ref<Video[]>([])
const filteredVideos = ref<Video[]>([])
const controls = ref<VideoControl>({ fromDate: new Date() })

const toolbarActions = computed<PVideoListToolbarAction[]>(() => [
  {
    active: showControls.value,
    count: 0,
    name: 'controls'
  }
])

const videosQuery = useVideosQuery()

useQueryHooks<Video[]>(videosQuery, {
  onSuccess: (rawVideos) => {
    videos.value = rawVideos
    filteredVideos.value = rawVideos
  }
})

const onIntersect = (intersectedVideo?: Video) => {
  video.value = intersectedVideo
}
</script>

<template>
  <PLoader :query="videosQuery">
    <template #default="{ data: videos }">
      <PVideoListToolbar
        class="sticky-top"
        :actions="toolbarActions"
        :scale="scale"
        :video="video"
        @click:controls="showControls = true"
      ></PVideoListToolbar>
      <PVideoList
        v-model:scale="scale"
        :videos="filteredVideos"
        @intersect="onIntersect"
      ></PVideoList>
      <PBottomBar>
        <PScaleButtonGroup
          key="PVideosRoute_BottomBar"
          class="w-100"
          v-model:scale="scale"
        ></PScaleButtonGroup>
      </PBottomBar>
      <PFullScreenModal
        :dim-backdrop="false"
        :show="showControls"
        :snap-toolbar="true"
        @close="showControls = false"
      >
        <PVideoListControls v-model="controls" :scale="scale" :videos="videos"></PVideoListControls>
      </PFullScreenModal>
    </template>
  </PLoader>
</template>
