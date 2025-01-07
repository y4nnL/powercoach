<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import PVideoList from '@/components/containment/lists/video/PVideoList.vue'
import PVideoListToolbar from '@/components/containment/toolbars/PVideoListToolbar.vue'
import PLoader from '@/components/containment/loaders/PLoader.vue'
import PScaleButtonGroup from '@/components/containment/buttons/PScaleButtonGroup.vue'
import { useVideosQuery } from '@/composables/useVideosQuery'
import { Scale, type Video } from '@/types'

const { t } = useI18n()

const videosQuery = useVideosQuery()

const scale = ref<Scale>(Scale.All)

const video = ref<Video>()

const onIntersect = (intersectedVideo?: Video) => {
  video.value = intersectedVideo
}
</script>

<template>
  <PLoader :query="videosQuery">
    <template #default="{ data: videos }">
      <PVideoListToolbar class="sticky-top" :scale="scale" :video="video" />
      <PVideoList v-model:scale="scale" :videos="videos" @intersect="onIntersect" />
      <Teleport to="#fixed-bottom">
        <PScaleButtonGroup
          class="PScaleButtonGroup w-100"
          v-model:scale="scale"
          :all-message="t('PVideosRoute_allVideos')"
        />
      </Teleport>
    </template>
  </PLoader>
</template>

<style lang="scss">
.PVideoList {
  padding-bottom: 2.5rem !important;
}
.PScaleButtonGroup {
  height: 2.5rem;
}
</style>
