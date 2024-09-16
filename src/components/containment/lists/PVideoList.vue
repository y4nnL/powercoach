<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Scale, type Video } from '@/types'
import PVideoListItem from '@/components/containment/lists/PVideoListItem.vue'
import PVideoListItemGroup from '@/components/containment/lists/PVideoListItemGroup.vue'
import vIntersect from '@/directives/PIntersect'
import PScaleTransition, {
  type PScaleTransitionProps
} from '@/components/transitions/PScaleTransition.vue'
import { useHumanReadability } from '@/composables/useHumanReadability'

export type PVideoListProps = {
  videos: Video[]
}

type VideoGroup = {
  subtitle: string
  title: string
  videos: Video[]
}

const scale = defineModel<Scale>('scale', { required: true })

const props = defineProps<PVideoListProps>()

const emit = defineEmits<{
  'update:scale': [Scale]
  'update:title': [string]
}>()

const visibilities = ref<Record<string, boolean>>({})

const { d } = useI18n()

const { getBlockName, getBlockScaleDate, getWeekName, getWeekScaleDate } = useHumanReadability()

const groups = computed<VideoGroup[]>(() => {
  if (scale.value === Scale.Block) {
    return groupVideosBy({
      index: (video) => video.block.id,
      subtitle: (videos) => getBlockScaleDate(videos),
      title: ([video]) => getBlockName(video.block)
    })
  }
  if (scale.value === Scale.Week) {
    return groupVideosBy({
      index: (video) => [video.block.id, video.week.id].join('-'),
      subtitle: (videos) => getWeekScaleDate(videos),
      title: ([video]) => getWeekName(video.week)
    })
  }
  if (scale.value === Scale.Workout) {
    return groupVideosBy({
      index: (video) => [video.block.id, video.week.id, video.workout.id].join('-'),
      subtitle: (videos) => getWeekScaleDate(videos),
      title: ([video]) => video.week.name ?? `Block #${video.week.index + 1}`
    })
  }
  return [
    {
      title: d(props.videos[props.videos.length - 1].date),
      subtitle: '',
      videos: props.videos
    }
  ]
})

const scaleTransitionDirection = ref<PScaleTransitionProps['direction']>('in')

function groupVideosBy({
  index,
  title,
  subtitle
}: {
  index: (video: Video) => string
  title: (videos: Video[]) => string
  subtitle: (videos: Video[]) => string
}): VideoGroup[] {
  return Object.entries(
    props.videos.reduce<Record<string, Video[]>>(
      (blocks, video) => ({
        ...blocks,
        [index(video)]: (blocks[index(video)] ?? []).concat(video)
      }),
      {}
    )
  ).map(([, videos]) => ({
    subtitle: subtitle(videos),
    title: title(videos),
    videos
  }))
}

watch(
  () => scale.value,
  (newScale, oldScale) => {
    const scaleZIndex: { [scale in Scale]: number } = {
      block: 6,
      week: 5,
      workout: 4,
      exercise: 3,
      set: 2,
      all: 1
    }
    scaleTransitionDirection.value =
      scaleZIndex[oldScale] - scaleZIndex[newScale] > 0 ? 'in' : 'out'
  }
)
</script>

<template>
  <div class="container-fluid">
    <PScaleTransition :direction="scaleTransitionDirection">
      <div v-if="scale === Scale.All" key="all" class="row gy-0">
        <PVideoListItem
          v-for="video in props.videos"
          class="col-4 col-md-2 gx-0"
          :key="video.id"
          :video="video"
          :visible="visibilities[video.id] ?? false"
          v-intersect="() => (visibilities[video.id] = true)"
        />
      </div>
      <div v-else-if="scale === Scale.Block" key="block" class="row gy-0">
        <div class="col-12 mb-4" v-for="group in groups" :key="group.title">
          <PVideoListItemGroup
            :videos="group.videos"
            :title="group.title"
            :subtitle="group.subtitle"
            @click="emit('update:scale', Scale.Week)"
          ></PVideoListItemGroup>
        </div>
      </div>
      <div v-else-if="scale === Scale.Week" key="week" class="row gy-0">
        <div
          class="col-12"
          v-for="(group, index) in groups"
          :key="group.title"
          :class="`mb-${group.videos[0]?.block.id === groups[index + 1]?.videos[0]?.block.id ? 2 : 5}`"
        >
          <PVideoListItemGroup
            :videos="group.videos"
            :title="group.title"
            :subtitle="group.subtitle"
            :preview="6"
            @click="emit('update:scale', Scale.Week)"
          ></PVideoListItemGroup>
        </div>
      </div>
    </PScaleTransition>
  </div>
  <RouterView />
</template>
