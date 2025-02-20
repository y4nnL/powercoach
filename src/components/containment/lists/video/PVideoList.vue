<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Scale, type Block, type Video, type Week, type Workout } from '@/types'
import PVideoListItem from '@/components/containment/lists/video/PVideoListItem.vue'
import PVideoListGroup from '@/components/containment/lists/video/PVideoListGroup.vue'
import PVideoListDivider from '@/components/containment/lists/video/PVideoListDivider.vue'
import vIntersect from '@/directives/PIntersect'
import { useHumanReadability } from '@/composables/useHumanReadability'
import { useMainScroll } from '@/composables/useMainScroll'
import { useRefStore } from '@/stores/ref'
import { useSettingsStore } from '@/stores/settings'
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
  key: (video: Video) => string[]
  subtitle: (group: Omit<VideoGroup, 'anchors' | 'subtitle' | 'title'>) => string
  title: (group: Omit<VideoGroup, 'anchors' | 'subtitle' | 'title'>) => string
}

const scale = defineModel<Scale>('scale', { required: true })

const props = defineProps<PVideoListProps>()

const emit = defineEmits<{
  'update:scale': [scale: Scale]
  intersect: [video: Video | undefined]
}>()

const intersections = ref<Record<string, boolean>>({})
const container = ref<HTMLElement | null>(null)

const main = useRefStore().get('main')
const toolbar = useRefStore().get('toolbar')

const anchors = ref<PVideoListTransitionProps['anchors']>()

const { blockName, blockScaleDate, weekName, weekScaleDate, workoutName, workoutScaleDate } =
  useHumanReadability()

const {
  video: { blockVideosPreview, weekVideosPreview, workoutVideosPreview }
} = useSettingsStore()

const { y: mainScrollY } = useMainScroll(50)

const groups = computed<VideoGroup[] | null>(() => {
  if (scale.value === Scale.Block) {
    return createVideoGroups({
      key: (video) => [video.block.id],
      subtitle: ({ videos }) => blockScaleDate(videos),
      title: ({ block }) => blockName(block)
    })
  }
  if (scale.value === Scale.Week) {
    return createVideoGroups({
      key: (video) => [video.block.id, video.week.id],
      subtitle: ({ videos }) => weekScaleDate(videos),
      title: ({ week }) => weekName(week)
    })
  }
  if (scale.value === Scale.Workout) {
    return createVideoGroups({
      key: (video) => [video.block.id, video.week.id, video.workout.id],
      subtitle: ({ videos }) => workoutScaleDate(videos),
      title: ({ workout }) => workoutName(workout)
    })
  }
  return null
})

const toolbarHeight = computed<number>(() => {
  return toolbar.value?.clientHeight ?? 0
})

const intersectionOptions = computed(() => ({
  root: main.value,
  rootMargin: `-${toolbarHeight.value}px 0px 0px 0px`
}))

function getElements(dataKeys: string[]): HTMLElement[] {
  return Array.from(
    (container.value?.querySelectorAll(
      dataKeys.map((dataKey) => `[data-${dataKey}]`).join('')
    ) as unknown as HTMLElement[]) ?? []
  )
}

function getIntersectingElements(dataKey?: string): HTMLElement[] {
  return getElements(['intersection-id', ...((dataKey && [dataKey]) ?? [])]).filter(
    (el) => intersections.value[el.dataset.intersectionId!]
  )
}

function createVideoGroups({ key, title, subtitle }: CreateVideoGroup): VideoGroup[] {
  return Object.entries(
    props.videos.reduce<Record<string, Video[]>>((group, video) => {
      const groupKey = key(video).join('-')
      return { ...group, [groupKey]: [...(group[groupKey] ?? []), video] }
    }, {})
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

function updateAnchor() {
  anchors.value = JSON.parse(
    getIntersectingElements('anchors')[0]?.dataset.anchors!
  ) as PVideoListTransitionProps['anchors']
}

function updateDivider() {
  getElements(['divider-title']).forEach((el) => {
    el.style.opacity = `${((el.getBoundingClientRect().top - toolbarHeight.value) * 1.25) / 100}`
  })
}

function updateIntersection() {
  const [[id] = []] = getIntersectingElements()
    .map((el) => [el.dataset.intersectionId])
    .slice(0, 1)
  if (id) {
    const foundVideo = props.videos.find((video) => video.id === id)
    emit('intersect', foundVideo)
  }
}

function updateAll() {
  updateAnchor()
  updateDivider()
  updateIntersection()
}

function zoomIn(group: VideoGroup, scale: Scale) {
  anchors.value = group.anchors
  emit('update:scale', scale)
}

function onTransitionComplete(scrollY: number) {
  const update = Math.round(mainScrollY.value) === Math.round(scrollY)
  mainScrollY.value = scrollY
  update && updateAll()
}

watch(mainScrollY, updateAll)
</script>

<template>
  <div v-if="main && toolbar" class="PVideoList container-fluid" ref="container">
    <PVideoListTransition
      :scale="scale"
      :anchors="anchors"
      :offset-top="toolbarHeight"
      @complete="onTransitionComplete"
      @progress="updateDivider"
    >
      <div v-if="scale === Scale.All" key="all" class="row">
        <PVideoListItem
          v-for="{ id, ...video } in props.videos"
          class="col col-4 col-md-2"
          :id="id"
          :key="id"
          :video="{ id, ...video }"
          :data-intersection-id="id"
          :data-anchors="
            JSON.stringify({
              block: video.block.id,
              week: video.week.id,
              workout: video.workout.id,
              all: id
            })
          "
          v-intersect="{
            on: (is: boolean) => (intersections[id] = is),
            options: intersectionOptions
          }"
        />
      </div>
      <template v-if="groups">
        <div v-if="scale === Scale.Block" key="block" class="row">
          <div
            class="PVideoListGroup col col-12"
            v-for="(group, i) in groups"
            :key="group.block.id"
          >
            <PVideoListDivider v-if="i > 0"></PVideoListDivider>
            <PVideoListGroup
              :id="group.block.id"
              :videos="group.videos"
              :title="group.title"
              :subtitle="group.subtitle"
              :preview="blockVideosPreview"
              :data-intersection-id="group.videos[0].id"
              :data-anchors="JSON.stringify(group.anchors)"
              @click:video="() => zoomIn(group, Scale.Week)"
              v-intersect="{
                on: (is: boolean) => (intersections[group.videos[0].id] = is),
                options: intersectionOptions
              }"
            ></PVideoListGroup>
          </div>
        </div>
        <div v-else-if="scale === Scale.Week" key="week" class="row">
          <div
            class="PVideoListGroup col col-12"
            v-for="({ block, week, ...group }, i) in groups"
            :key="week.id"
          >
            <PVideoListDivider
              v-if="i > 0 && block.id !== groups[i - 1].block.id"
              :title="blockName(block)"
              :data-divider-title="true"
            ></PVideoListDivider>
            <PVideoListDivider v-else-if="i > 0"></PVideoListDivider>
            <PVideoListGroup
              :id="week.id"
              :videos="group.videos"
              :title="group.title"
              :subtitle="group.subtitle"
              :preview="weekVideosPreview"
              :data-intersection-id="group.videos[0].id"
              :data-group-title="blockName(block)"
              :data-anchors="JSON.stringify(group.anchors)"
              v-intersect="{
                on: (visible: boolean) => (intersections[group.videos[0].id] = visible),
                options: intersectionOptions
              }"
              @click:video="() => zoomIn({ block, week, ...group }, Scale.Workout)"
            ></PVideoListGroup>
          </div>
        </div>
        <div v-else-if="scale === Scale.Workout" key="workout" class="row">
          <div
            class="PVideoListGroup col col-12"
            v-for="({ block, week, workout, ...group }, i) in groups"
            :key="workout.id"
          >
            <PVideoListDivider
              v-if="i > 0 && week.id !== groups[i - 1].week.id"
              :title="blockName(block)"
              :subtitle="weekName(week)"
              :data-divider-title="true"
            ></PVideoListDivider>
            <PVideoListDivider v-else-if="i > 0"></PVideoListDivider>
            <PVideoListGroup
              :id="workout.id"
              :videos="group.videos"
              :title="group.title"
              :subtitle="group.subtitle"
              :preview="workoutVideosPreview"
              :data-intersection-id="group.videos[0].id"
              :data-group-title="blockName(block)"
              :data-group-subtitle="weekName(week)"
              :data-anchors="JSON.stringify(group.anchors)"
              v-intersect="{
                on: (is: boolean) => (intersections[group.videos[0].id] = is),
                options: intersectionOptions
              }"
              @click:video="() => zoomIn({ block, week, workout, ...group }, Scale.All)"
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
.PVideoList .container-fluid,
.PVideoList .row,
.PVideoList .col {
  margin: 0 !important;
  padding: 0 !important;
}
.PVideoList .PVideoListGroup.col:last-child {
  margin-bottom: 0.75rem !important;
}
</style>
