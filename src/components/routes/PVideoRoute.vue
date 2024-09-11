<script setup lang="ts">
import PLoader from '@/components/containment/loaders/PLoader.vue'
import { useVideoQuery } from '@/composables/useVideoQuery'

type PVideoRouteProps = {
  id: string
}

const props = defineProps<PVideoRouteProps>()

const videoQuery = useVideoQuery(props.id)
</script>

<template>
  <PLoader :query="videoQuery">
    <template #default="{ data }">
      {{ data.id }}
    </template>
  </PLoader>
</template>
