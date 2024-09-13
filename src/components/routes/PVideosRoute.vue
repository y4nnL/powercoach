<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import PVideoList from '@/components/containment/lists/PVideoList.vue'
import PVideoListToolbar from '@/components/containment/toolbars/PVideoListToolbar.vue'
import PLoader from '@/components/containment/loaders/PLoader.vue'
import PScaleButtonGroup from '@/components/containment/buttons/PScaleButtonGroup.vue'
import { useVideosQuery } from '@/composables/useVideosQuery'
import { Scale } from '@/types'

const { t } = useI18n()
const videosQuery = useVideosQuery()

const scale = ref<Scale>(Scale.All)
</script>

<template>
  <PLoader :query="videosQuery">
    <template #default="{ data: videos }">
      <PVideoListToolbar class="sticky-top bg-transparent" />
      <PVideoList v-model:scale="scale" :videos="videos" />
      <Teleport to="#fixed-bottom">
        <PScaleButtonGroup
          class="position-relative start-50 translate-middle-x mb-2"
          v-model:scale="scale"
          :all-message="t('PVideosRoute_allVideos')"
        />
      </Teleport>
    </template>
  </PLoader>
</template>
