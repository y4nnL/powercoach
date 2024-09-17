<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Scale, type Block, type Video, type Week, type Workout } from '@/types'
import PVideoListItem from '@/components/containment/lists/PVideoListItem.vue'
import PVideoListItemGroup from '@/components/containment/lists/PVideoListItemGroup.vue'
import vIntersect from '@/directives/PIntersect'
import { useHumanReadability } from '@/composables/useHumanReadability'
import { useMainScroll } from '@/composables/useMainScroll'

export type PVideoListProps = {
  videos: Video[]
}

type VideoGroup = {
  block: Block
  subtitle: string
  title: string
  videos: Video[]
  week: Week
  workout: Workout
}

const scale = defineModel<Scale>('scale', { required: true })

const props = defineProps<PVideoListProps>()

const emit = defineEmits<{
  'update:scale': [scale: Scale]
  'update:title': [title: string | undefined, subtitle: string | undefined]
}>()

const imageVisibilities = ref<Record<string, boolean>>({})
const titleVisibilities = ref<Record<string, boolean>>({})

const container = ref<HTMLElement | null>(null)

const {
  getBlockName,
  getBlockScaleDate,
  getVideoDate,
  getWeekName,
  getWeekScaleDate,
  getWorkoutName,
  getWorkoutScaleDate
} = useHumanReadability()

const { y: scrollY } = useMainScroll()

const groups = computed<VideoGroup[] | null>(() => {
  if (scale.value === Scale.Block) {
    emit('update:title')
    return createVideoGroups({
      index: (video) => video.block.id,
      subtitle: (videos) => getBlockScaleDate(videos),
      title: ([video]) => getBlockName(video.block)
    })
  }

  if (scale.value === Scale.Week) {
    const videoGroups = createVideoGroups({
      index: (video) => [video.block.id, video.week.id].join('-'),
      subtitle: (videos) => getWeekScaleDate(videos),
      title: ([video]) => getWeekName(video.week)
    })
    emit('update:title', getBlockName(videoGroups[0].block))
    return videoGroups
  }

  if (scale.value === Scale.Workout) {
    const videoGroups = createVideoGroups({
      index: (video) => [video.block.id, video.week.id, video.workout.id].join('-'),
      subtitle: (videos) => getWorkoutScaleDate(videos),
      title: ([video]) => getWorkoutName(video.workout)
    })
    emit('update:title', getWeekName(videoGroups[0].week), getBlockName(videoGroups[0].block))
    return videoGroups
  }

  emit('update:title', getVideoDate(props.videos[0]))
  return null
})

function createVideoGroups({
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
    block: videos[0].block,
    subtitle: subtitle(videos),
    title: title(videos),
    videos,
    week: videos[0].week,
    workout: videos[0].workout
  }))
}

watch(
  () => scrollY.value,
  () => {
    const elements = container.value?.querySelectorAll('[data-visibility-id][data-title]')
    const titles = Array.from(elements as unknown as HTMLElement[])
      .filter((e) => titleVisibilities.value[e.dataset.visibilityId!])
      .map((e) => [e.dataset.title, e.dataset.subtitle])
    if (titles.length) {
      const [title, subtitle] = titles[0]
      emit('update:title', title, subtitle)
    }
  }
)
</script>

<template>
  <div class="container-fluid" ref="container">
    <div v-if="scale === Scale.All" key="all" class="row gy-0">
      <PVideoListItem
        v-for="video in props.videos"
        class="col-4 col-md-2 gx-0"
        :key="video.id"
        :video="video"
        :visible="imageVisibilities[video.id] ?? false"
        :data-visibility-id="video.id"
        :data-title="getVideoDate(video)"
        v-intersect="() => (imageVisibilities[video.id] = true)"
        v-intersect.both.keep.immediate="
          (visibility: boolean) => {
            titleVisibilities[video.id] = visibility
          }
        "
      />
    </div>
    <template v-if="groups">
      <div v-if="scale === Scale.Block" key="block" class="row gy-0">
        <div class="col-12 mb-5" v-for="group in groups" :key="group.title">
          <PVideoListItemGroup
            :videos="group.videos"
            :title="group.title"
            :subtitle="group.subtitle"
            @click="emit('update:scale', Scale.Week)"
          ></PVideoListItemGroup>
        </div>
      </div>
      <div v-else-if="scale === Scale.Week" key="week" class="row gy-0">
        <div class="col-12 mb-2" v-for="group in groups" :key="group.title">
          <PVideoListItemGroup
            :videos="group.videos"
            :title="group.title"
            :subtitle="group.subtitle"
            :preview="6"
            :data-visibility-id="group.week.id"
            :data-title="getBlockName(group.block)"
            v-intersect.both.keep.immediate="
              (visibility: boolean) => (titleVisibilities[group.week.id] = visibility)
            "
            @click="emit('update:scale', Scale.Workout)"
          ></PVideoListItemGroup>
        </div>
      </div>
      <div v-else-if="scale === Scale.Workout" key="workout" class="row gy-0">
        <div class="col-12 mb-2" v-for="group in groups" :key="group.title">
          <PVideoListItemGroup
            :videos="group.videos"
            :title="group.title"
            :subtitle="group.subtitle"
            :preview="3"
            :data-visibility-id="group.workout.id"
            :data-title="getWeekName(group.week)"
            :data-subtitle="getBlockName(group.block)"
            v-intersect.both.keep.immediate="
              (visibility: boolean) => (titleVisibilities[group.workout.id] = visibility)
            "
            @click="emit('update:scale', Scale.All)"
          ></PVideoListItemGroup>
        </div>
      </div>
    </template>
  </div>
  <RouterView />
</template>
