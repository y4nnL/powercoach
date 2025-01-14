<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { type Message, Scale, type Video } from '@/types'
import { useVideosQuery } from '@/composables/useVideosQuery'
import PVideoList from '@/components/containment/lists/video/PVideoList.vue'
import PVideoListToolbar from '@/components/containment/toolbars/PVideoListToolbar.vue'
import PLoader from '@/components/containment/loaders/PLoader.vue'
import PScaleButtonGroup from '@/components/containment/buttons/PScaleButtonGroup.vue'
import BottomBar from '@/components/containment/toolbars/BottomBar.vue'
import FullScreenModal from '@/components/containment/modals/FullScreenModal.vue'
import PVideoListControl from '@/components/controls/PVideoListControl.vue'

const scale = ref<Scale>(Scale.All)
const video = ref<Video>()
const showFilters = ref<boolean>(false)

const { t } = useI18n<{ message: Message }>()
const videosQuery = useVideosQuery()

const onIntersect = (intersectedVideo?: Video) => {
  video.value = intersectedVideo
}
</script>

<template>
  <PLoader :query="videosQuery">
    <template #default="{ data: videos }">
      <PVideoListToolbar
        class="sticky-top"
        :scale="scale"
        :video="video"
        :filters="3"
        :activate-filters="showFilters"
        @click:filters="showFilters = true"
      ></PVideoListToolbar>
      <PVideoList v-model:scale="scale" :videos="videos" @intersect="onIntersect"></PVideoList>
      <BottomBar>
        <PScaleButtonGroup
          class="w-100"
          v-model:scale="scale"
          :all-message="t('PVideosRoute_allVideos')"
        ></PScaleButtonGroup>
      </BottomBar>
      <FullScreenModal
        :dim-backdrop="false"
        :offset="25"
        :show="showFilters"
        @close="showFilters = false"
        snap-toolbar
      >
        <PVideoListControl v-model:scale="scale"></PVideoListControl>
      </FullScreenModal>
    </template>
  </PLoader>
</template>
