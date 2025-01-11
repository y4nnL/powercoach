<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Scale, type Video } from '@/types'
import { useVideosQuery } from '@/composables/useVideosQuery'
import PVideoList from '@/components/containment/lists/video/PVideoList.vue'
import PVideoListToolbar from '@/components/containment/toolbars/PVideoListToolbar.vue'
import PLoader from '@/components/containment/loaders/PLoader.vue'
import PScaleButtonGroup from '@/components/containment/buttons/PScaleButtonGroup.vue'
import BottomBar from '@/components/containment/teleports/BottomBar.vue'
import FullScreenModal from '@/components/containment/teleports/FullScreenModal.vue'
import PVideoListControl from '@/components/controls/PVideoListControl.vue'

const { t } = useI18n()

const videosQuery = useVideosQuery()

const scale = ref<Scale>(Scale.All)

const video = ref<Video>()

const showFilters = ref<boolean>(false)

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
      />
      <PVideoList v-model:scale="scale" :videos="videos" @intersect="onIntersect" />
      <BottomBar>
        <PScaleButtonGroup
          key="PVideosRoute_PScaleButtonGroup"
          class="w-100"
          v-model:scale="scale"
          :all-message="t('PVideosRoute_allVideos')"
        />
      </BottomBar>
      <FullScreenModal :show="showFilters" @close="showFilters = false" :offset="17">
        <PVideoListControl v-model:scale="scale"></PVideoListControl>
      </FullScreenModal>
    </template>
  </PLoader>
</template>
