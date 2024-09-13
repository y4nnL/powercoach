<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Scale, type Video } from '@/types'
import PVideoListItem from '@/components/containment/lists/PVideoListItem.vue'
import PVideoListItemGroup from '@/components/containment/lists/PVideoListItemGroup.vue'
import vIntersect from '@/directives/PIntersect'

export type PVideoListProps = {
  videos: Video[]
}

type VideoGroup = {
  title: string
  videos: Video[]
}

const scale = defineModel<Scale>('scale', { required: true })

const props = defineProps<PVideoListProps>()

const emit = defineEmits<{
  'update:scale': [Scale]
}>()

const visibilities = ref<Record<string, boolean>>({})

const { t, d } = useI18n()

const groups = computed<VideoGroup[]>(() => {
  if (scale.value === Scale.Block) {
    return groupVideosBy((v) => v.blockId)
  }
  if (scale.value === Scale.Week) {
    return groupVideosBy((v) => v.blockId + v.weekId)
  }
  if (scale.value === Scale.Workout) {
    return groupVideosBy((v) => v.blockId + v.weekId + v.workoutId)
  }
  return [
    {
      title: d(props.videos[props.videos.length - 1].date),
      videos: props.videos
    }
  ]
})

function getVideoGroupTitle(videos: Video[]): string {
  const from = d(videos[0].date)
  const to = d(videos[videos.length - 1].date)
  return from === to ? from : t('common_fromTo', { from, to })
}

function groupVideosBy(getIndex: (video: Video) => string): VideoGroup[] {
  return Object.entries(
    props.videos.reduce(
      (blocks, video) => ({
        ...blocks,
        [getIndex(video)]: (blocks[getIndex(video)] ?? []).concat(video)
      }),
      {} as Record<string, Video[]>
    )
  ).map(([, videos]) => ({
    title: getVideoGroupTitle(videos),
    videos
  }))
}
</script>

<template>
  <div class="container-fluid">
    <div class="row gy-0">
      <template v-if="scale === Scale.All">
        <PVideoListItem
          v-for="video in props.videos"
          class="col-4 col-md-2 gx-0"
          :key="video.id"
          :video="video"
          :visible="visibilities[video.id] ?? false"
          v-intersect="() => (visibilities[video.id] = true)"
        />
      </template>
      <template v-if="scale === Scale.Block">
        <div class="col-12 gy-4" v-for="group in groups" :key="group.title">
          <PVideoListItemGroup
            :videos="group.videos"
            :title="group.title"
            :subtitle="group.videos[0].blockId"
            @click="emit('update:scale', Scale.Week)"
          ></PVideoListItemGroup>
        </div>
      </template>
    </div>
  </div>
  <RouterView />
</template>
