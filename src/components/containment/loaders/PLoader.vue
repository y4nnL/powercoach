<script setup lang="ts">
import type { UseVideosQueryReturnType } from '@/types'

export type PLoaderProps = {
  useQuery: UseVideosQueryReturnType
}

const props = defineProps<PLoaderProps>()

const { data, isPending } = props.useQuery
</script>

<template>
  <template v-if="isPending">
    <slot name="pending">
      <div class="h-100 d-flex flex-column justify-content-center align-items-center">
        <span class="spinner-border" aria-hidden="true"></span>
      </div>
    </slot>
  </template>
  <slot v-else-if="data" :data="data" />
</template>
