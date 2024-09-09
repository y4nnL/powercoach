<script setup lang="ts">
import { computed } from 'vue'
import PIcon, { type PIconProps } from '@/components/icons/PIcon.vue'
import type { VideoTag } from '@/types'

export type PTagIconProps = Omit<PIconProps, 'path'> & {
  tag: VideoTag
}

const TAG_ICON: { [name in VideoTag]: PIconProps['path'] } = {
  pass: 'mdiCheckboxMarkedCircleOutline',
  fail: 'mdiCloseCircleOutline',
  review: 'mdiCheckAll',
  comment: 'mdiMessageOutline',
  great: 'mdiThumbUpOutline',
  pb: 'mdiTrophyOutline'
}

const props = defineProps<PTagIconProps>()

const path = computed<PIconProps['path']>(() => TAG_ICON[props.tag] ?? 'mdiHelp')
</script>

<template>
  <PIcon :path="path" :size="size" />
</template>
