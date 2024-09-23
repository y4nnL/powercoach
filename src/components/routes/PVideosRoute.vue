<script setup lang="ts">
import { ref, type ComponentInstance } from 'vue'
import { useI18n } from 'vue-i18n'
import PVideoList from '@/components/containment/lists/video/PVideoList.vue'
import PVideoListToolbar from '@/components/containment/toolbars/PVideoListToolbar.vue'
import PLoader from '@/components/containment/loaders/PLoader.vue'
import PScaleButtonGroup from '@/components/containment/buttons/PScaleButtonGroup.vue'
import { useVideosQuery } from '@/composables/useVideosQuery'
import { Scale } from '@/types'

const { t } = useI18n()

const videosQuery = useVideosQuery()

const scale = ref<Scale>(Scale.All)

const titles = ref<{ title?: string; subtitle?: string }>({})

const onUpdateTitle: ComponentInstance<typeof PVideoList>['onUpdate:title'] = (updatedTitles) => {
  titles.value = updatedTitles
}
</script>

<template>
  <PLoader :query="videosQuery">
    <template #default="{ data: videos }">
      <PVideoListToolbar class="sticky-top" v-bind="titles" />
      <PVideoList v-model:scale="scale" :videos="videos" @update:title="onUpdateTitle" />
      <Teleport to="#fixed-bottom">
        <PScaleButtonGroup
          class="w-100 mb-2"
          v-model:scale="scale"
          :all-message="t('PVideosRoute_allVideos')"
        />
      </Teleport>
    </template>
  </PLoader>
</template>
