<script setup lang="ts">
import PVideoList from '@/components/containment/lists/PVideoList.vue'
import PVideoListToolbar from '@/components/containment/toolbars/PVideoListToolbar.vue'
import PLoader from '@/components/containment/loaders/PLoader.vue'
import { useVideosQuery } from '@/composables/useVideosQuery'

const videoQuery = useVideosQuery()
</script>

<template>
  <PLoader :use-query="videoQuery">
    <template #default="{ data }">
      <PVideoListToolbar class="sticky-top bg-transparent" />
      <PVideoList :videos="data" />
    </template>
  </PLoader>
</template>
