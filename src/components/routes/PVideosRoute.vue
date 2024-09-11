<script setup lang="ts">
import PVideoList from '@/components/containment/lists/PVideoList.vue'
import PVideoListToolbar from '@/components/containment/toolbars/PVideoListToolbar.vue'
import PLoader from '@/components/containment/loaders/PLoader.vue'
import { useVideosQuery } from '@/composables/useVideosQuery'

const videosQuery = useVideosQuery()
</script>

<template>
  <PLoader :query="videosQuery">
    <template #default="{ data: videos }">
      <PVideoListToolbar class="sticky-top bg-transparent" />
      <PVideoList :videos="videos" />
    </template>
  </PLoader>
</template>
