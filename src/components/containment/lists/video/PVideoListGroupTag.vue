<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { type Video, type VideoTag } from '@/types'
import PTagIcon from '@/components/icons/PTagIcon.vue'

export type PVideoListItemProps = {
  tag?: VideoTag
  videos: Video[]
}

const props = defineProps<PVideoListItemProps>()

const { t } = useI18n()

const count = computed<number>(() =>
  props.tag
    ? props.videos.reduce((c, { tags }) => c + (tags.includes(props.tag!) ? 1 : 0), 0)
    : props.videos.length
)

const baseClass = 'd-flex gap-1 align-content-lg-stretch'
</script>

<template>
  <div v-if="props.tag" :class="[baseClass, 'PVideoListGroupTagText']">
    <PTagIcon :tag="props.tag!" :size="12" class="align-self-center" />
    <strong>{{ count }}</strong>
    <span>{{ t(`video_tag_adj_${tag}`, count!) }}</span>
  </div>
  <div v-else :class="[baseClass, 'PVideoListGroupTagVideoText']">
    <strong>{{ count }}</strong>
    <span>{{ t('video', count) }}</span>
  </div>
</template>

<style scoped>
.PVideoListGroupTagVideoText {
  font-size: 80%;
  opacity: 0.8;
}
.PVideoListGroupTagText {
  font-size: 55%;
  opacity: 0.6;
}
</style>
