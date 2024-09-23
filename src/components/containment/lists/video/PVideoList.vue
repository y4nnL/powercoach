<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { Scale, type Block, type Video, type Week, type Workout } from '@/types'
import PVideoListItem from '@/components/containment/lists/video/PVideoListItem.vue'
import PVideoListGroup from '@/components/containment/lists/video/PVideoListGroup.vue'
import PVideoListDivider from '@/components/containment/lists/video/PVideoListDivider.vue'
import vIntersect from '@/directives/PIntersect'
import { useHumanReadability } from '@/composables/useHumanReadability'
import { useMainScroll } from '@/composables/useMainScroll'
import { useRefStore } from '@/stores/ref'
import PVideoListTransition, {
  type PVideoListTransitionProps
} from '@/components/transitions/PVideoListTransition.vue'

export type PVideoListProps = {
  videos: Video[]
}

type VideoGroup = {
  anchors: PVideoListTransitionProps['anchors']
  block: Block
  subtitle: string
  title: string
  videos: Video[]
  week: Week
  workout: Workout
}

type CreateVideoGroup = {
  key: (video: Video) => string
  subtitle: (group: Omit<VideoGroup, 'anchors' | 'subtitle' | 'title'>) => string
  title: (group: Omit<VideoGroup, 'anchors' | 'subtitle' | 'title'>) => string
}

const scale = defineModel<Scale>('scale', { required: true })

const props = defineProps<PVideoListProps>()

const emit = defineEmits<{
  'update:scale': [scale: Scale]
  'update:title': [{ title?: string; subtitle?: string }]
}>()

const intersections = ref<Record<string, boolean>>({})

const container = ref<HTMLElement | null>(null)

const main = useRefStore().get('main')

const toolbar = useRefStore().get('toolbar')

const anchors = ref<PVideoListTransitionProps['anchors']>()

const {
  blockName,
  blockScaleDate,
  videoDate,
  weekName,
  weekScaleDate,
  workoutName,
  workoutScaleDate
} = useHumanReadability()

const { y: scrollY } = useMainScroll(50)

const groups = computed<VideoGroup[] | null>(() => {
  if (scale.value === Scale.Block) {
    emit('update:title', {})
    return createVideoGroups({
      key: (video) => video.block.id,
      subtitle: ({ videos }) => blockScaleDate(videos),
      title: ({ block }) => blockName(block)
    })
  }

  if (scale.value === Scale.Week) {
    const videoGroups = createVideoGroups({
      key: (video) => [video.block.id, video.week.id].join('-'),
      subtitle: ({ videos }) => weekScaleDate(videos),
      title: ({ week }) => weekName(week)
    })
    const [{ block }] = videoGroups
    emit('update:title', { title: blockName(block) })
    return videoGroups
  }

  if (scale.value === Scale.Workout) {
    const videoGroups = createVideoGroups({
      key: (video) => [video.block.id, video.week.id, video.workout.id].join('-'),
      subtitle: ({ videos }) => workoutScaleDate(videos),
      title: ({ workout }) => workoutName(workout)
    })
    const [{ week, block }] = videoGroups
    emit('update:title', { title: blockName(block), subtitle: weekName(week) })
    return videoGroups
  }

  emit('update:title', { title: videoDate(props.videos[0]) })
  return null
})

const toolbarHeight = computed<number>(() => {
  return toolbar.value?.clientHeight ?? 0
})

const titleIntersectionRootMargin = computed<string>(() => {
  return `-${toolbarHeight.value}px 0px 0px 0px`
})

function getIntersectingElements(dataKey: string): HTMLElement[] {
  const elements = container.value?.querySelectorAll(`[data-intersection-id][data-${dataKey}]`)
  return Array.from(elements as unknown as HTMLElement[]).filter(
    (el) => intersections.value[el.dataset.intersectionId!]
  )
}

function createVideoGroups({ key, title, subtitle }: CreateVideoGroup): VideoGroup[] {
  return Object.entries(
    props.videos.reduce<Record<string, Video[]>>(
      (group, video) => ({ ...group, [key(video)]: [...(group[key(video)] ?? []), video] }),
      {}
    )
  ).map(([, videos]) => {
    const [{ block, week, workout }] = videos
    const group = { block, videos, week, workout }
    return {
      ...group,
      anchors: { block: block.id, week: week.id, workout: workout.id, all: videos[0].id },
      subtitle: subtitle(group),
      title: title(group)
    }
  })
}

function updateTitle() {
  getIntersectingElements('group-title')
    .map((el) => [el.dataset.groupTitle, el.dataset.groupSubtitle])
    .slice(0, 1)
    .forEach(([title, subtitle]) => {
      emit('update:title', { title, subtitle })
    })
  getIntersectingElements('divider-title').forEach((el) => {
    const { top } = el.getBoundingClientRect()
    el.style.opacity = (((top - toolbarHeight.value) * 1.5) / 100).toFixed(2)
  })
}

function updateAnchor() {
  anchors.value = JSON.parse(
    getIntersectingElements('anchors')[0]?.dataset.anchors!
  ) as PVideoListTransitionProps['anchors']
}

function zoomIn(group: VideoGroup, scale: Scale, id: string) {
  anchors.value = group.anchors
  emit('update:scale', scale)
}

function setMainScrollPaddingTop() {
  if (main.value && toolbarHeight.value) {
    main.value.style.scrollPaddingTop = `${toolbarHeight.value}px`
  }
}

function onTransitionComplete(scrollTop: number) {
  scrollY.value = scrollTop
}

onMounted(setMainScrollPaddingTop)
watch(() => scrollY.value, updateTitle)
watch(() => scrollY.value, updateAnchor)
</script>

<template>
  <div v-if="main && toolbar" class="PVideoList container-fluid" ref="container">
    <PVideoListTransition
      :scale="scale"
      :anchors="anchors"
      :offset-top="toolbarHeight"
      @complete="onTransitionComplete"
    >
      <div v-if="scale === Scale.All" key="all" class="row">
        <PVideoListItem
          v-for="{ id, ...video } in props.videos"
          class="col col-4 col-md-2"
          :id="id"
          :key="id"
          :video="{ id, ...video }"
          :data-intersection-id="`video_${id}`"
          :data-group-title="videoDate({ id, ...video })"
          :data-anchors="
            JSON.stringify({
              block: video.block.id,
              week: video.week.id,
              workout: video.workout.id,
              all: id
            })
          "
          v-intersect="{
            on: (is: boolean) => (intersections[`video_${id}`] = is),
            options: { root: main, rootMargin: titleIntersectionRootMargin }
          }"
        />
      </div>
      <template v-if="groups">
        <div v-if="scale === Scale.Block" key="block" class="row">
          <div class="col col-12" v-for="(group, i) in groups" :key="group.block.id">
            <PVideoListDivider v-if="i > 0"></PVideoListDivider>
            <PVideoListGroup
              :id="group.block.id"
              :videos="group.videos"
              :title="group.title"
              :subtitle="group.subtitle"
              :preview="6"
              :data-intersection-id="`block_${group.block.id}`"
              :data-anchors="JSON.stringify(group.anchors)"
              @click:video="({ id }) => zoomIn(group, Scale.Week, id)"
              v-intersect="{
                on: (is: boolean) => (intersections[`block_${group.block.id}`] = is),
                options: { rootMargin: titleIntersectionRootMargin }
              }"
            ></PVideoListGroup>
          </div>
        </div>
        <div v-else-if="scale === Scale.Week" key="week" class="row">
          <div class="col col-12" v-for="({ block, week, ...group }, i) in groups" :key="week.id">
            <PVideoListDivider
              v-if="i > 0 && block.id !== groups[i - 1].block.id"
              :title="blockName(block)"
              :data-intersection-id="`block_divider_${block.id}`"
              :data-divider-title="true"
              v-intersect="{
                on: (is: boolean) => (intersections[`block_divider_${block.id}`] = is),
                options: { rootMargin: titleIntersectionRootMargin }
              }"
            ></PVideoListDivider>
            <PVideoListDivider v-else-if="i > 0"></PVideoListDivider>
            <PVideoListGroup
              :id="week.id"
              :videos="group.videos"
              :title="group.title"
              :subtitle="group.subtitle"
              :preview="6"
              :data-intersection-id="`week_${week.id}`"
              :data-group-title="blockName(block)"
              :data-anchors="JSON.stringify(group.anchors)"
              v-intersect="{
                on: (visible: boolean) => (intersections[`week_${week.id}`] = visible),
                options: { rootMargin: titleIntersectionRootMargin }
              }"
              @click:video="({ id }) => zoomIn({ block, week, ...group }, Scale.Workout, id)"
            ></PVideoListGroup>
          </div>
        </div>
        <div v-else-if="scale === Scale.Workout" key="workout" class="row">
          <div
            class="col col-12"
            v-for="({ block, week, workout, ...group }, i) in groups"
            :key="workout.id"
          >
            <PVideoListDivider
              v-if="i > 0 && week.id !== groups[i - 1].week.id"
              :title="blockName(block)"
              :subtitle="weekName(week)"
              :data-intersection-id="`week_divider_${week.id}`"
              :data-divider-title="true"
              v-intersect="{
                on: (is: boolean) => (intersections[`week_divider_${week.id}`] = is),
                options: { rootMargin: titleIntersectionRootMargin }
              }"
            ></PVideoListDivider>
            <PVideoListDivider v-else-if="i > 0"></PVideoListDivider>
            <PVideoListGroup
              :id="workout.id"
              :videos="group.videos"
              :title="group.title"
              :subtitle="group.subtitle"
              :preview="3"
              :data-intersection-id="`workout_${workout.id}`"
              :data-group-title="blockName(block)"
              :data-group-subtitle="weekName(week)"
              :data-anchors="JSON.stringify(group.anchors)"
              v-intersect="{
                on: (is: boolean) => (intersections[`workout_${workout.id}`] = is),
                options: { rootMargin: titleIntersectionRootMargin }
              }"
              @click:video="({ id }) => zoomIn({ block, week, workout, ...group }, Scale.All, id)"
            ></PVideoListGroup>
          </div>
        </div>
      </template>
    </PVideoListTransition>
  </div>
  <RouterView />
</template>

<style>
.PVideoList,
.PVideoList .container,
.PVideoList .container-fluid,
.PVideoList .row,
.PVideoList .col {
  margin: 0 !important;
  padding: 0 !important;
}
</style>
