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

type CreateVideoGroup = {
  key: (video: Video) => string
  subtitle: (group: Omit<VideoGroup, 'subtitle' | 'title'>) => string
  title: (group: Omit<VideoGroup, 'subtitle' | 'title'>) => string
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

const main = useRefStore().get('main')
const toolbar = useRefStore().get('toolbar')

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
    emit('update:title')
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
    emit('update:title', blockName(block))
    return videoGroups
  }

  if (scale.value === Scale.Workout) {
    const videoGroups = createVideoGroups({
      key: (video) => [video.block.id, video.week.id, video.workout.id].join('-'),
      subtitle: ({ videos }) => workoutScaleDate(videos),
      title: ({ workout }) => workoutName(workout)
    })
    const [{ week, block }] = videoGroups
    emit('update:title', blockName(block), weekName(week))
    return videoGroups
  }

  emit('update:title', videoDate(props.videos[0]))
  return null
})

const titleIntersectionRootMargin = computed<string>(() => {
  return `-${toolbar.value?.clientHeight ?? 0}px 0px 0px 0px`
})

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
      subtitle: subtitle(group),
      title: title(group)
    }
  })
}

function updateTitle() {
  const elements = container.value?.querySelectorAll('[data-visibility-id][data-title]')
  const titleTuples = Array.from(elements as unknown as HTMLElement[])
    .filter((el) => titleVisibilities.value[el.dataset.visibilityId!])
    .map((el) => [el.dataset.title, el.dataset.subtitle])
  if (titleTuples.length) {
    const [title, subtitle] = titleTuples[0]
    emit('update:title', title, subtitle)
  }
  const titles = container.value?.querySelectorAll('[data-title-opacity="true"]')
  Array.from(titles as unknown as HTMLElement[]).forEach((el) => {
    const { top } = el.getBoundingClientRect()
    console.log(top)
    el.style.opacity = (((top - (toolbar.value?.clientHeight ?? 0)) * 1.5) / 100).toFixed(2)
  })
}

function zoomIn(scale: Scale, entity: Block | Week | Workout | Video) {
  emit('update:scale', scale)
  const observer = new MutationObserver(() => {
    const el = container.value!.querySelector(`[id="${entity.id}"]`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
      observer.disconnect()
    }
  })
  observer.observe(container.value!, {
    subtree: true,
    childList: true
  })
}

function scrollToTop() {
  scrollY.value = 0
}

function setMainScrollPaddingTop() {
  const main = useRefStore().get('main')
  const toolbar = useRefStore().get('toolbar')
  if (main.value && toolbar.value) {
    main.value.style.scrollPaddingTop = `${toolbar.value.clientHeight}px`
  }
}

onMounted(setMainScrollPaddingTop)
watch(() => scrollY.value, updateTitle)
watch(() => scale.value, scrollToTop)
</script>

<template>
  <div v-if="main && toolbar" class="container-fluid PVideoList" ref="container">
    <div v-if="scale === Scale.All" key="all" class="row">
      <PVideoListItem
        v-for="{ id, ...video } in props.videos"
        class="col col-4 col-md-2"
        :id="id"
        :key="id"
        :video="{ id, ...video }"
        :visible="imageVisibilities[id] ?? false"
        :data-visibility-id="id"
        :data-title="videoDate({ id, ...video })"
        v-intersect.delay.visible.once="{ on: () => (imageVisibilities[id] = true) }"
        v-intersect="{
          on: (visible: boolean) => (titleVisibilities[id] = visible),
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
            @click="zoomIn(Scale.Week, group.week)"
          ></PVideoListGroup>
        </div>
      </div>
      <div v-else-if="scale === Scale.Week" key="week" class="row">
        <div class="col col-12" v-for="({ week, ...group }, i) in groups" :key="week.id">
          <PVideoListDivider
            v-if="i > 0"
            :data-title-opacity="group.block.id !== groups[i - 1].block.id"
            :title="group.block.id !== groups[i - 1].block.id ? blockName(group.block) : undefined"
          ></PVideoListDivider>
          <PVideoListGroup
            :id="week.id"
            :videos="group.videos"
            :title="group.title"
            :subtitle="group.subtitle"
            :preview="6"
            :data-visibility-id="week.id"
            :data-title="blockName(group.block)"
            v-intersect="{
              on: (visible: boolean) => (titleVisibilities[week.id] = visible),
              options: { rootMargin: titleIntersectionRootMargin }
            }"
            @click="zoomIn(Scale.Workout, group.workout)"
          ></PVideoListGroup>
        </div>
      </div>
      <div v-else-if="scale === Scale.Workout" key="workout" class="row">
        <div class="col col-12" v-for="({ workout, ...group }, i) in groups" :key="workout.id">
          <PVideoListDivider
            v-if="i > 0"
            :data-title-opacity="group.week.id !== groups[i - 1].week.id"
            :title="group.week.id !== groups[i - 1].week.id ? blockName(group.block) : undefined"
            :subtitle="group.week.id !== groups[i - 1].week.id ? weekName(group.week) : undefined"
          ></PVideoListDivider>
          <PVideoListGroup
            :id="workout.id"
            :videos="group.videos"
            :title="group.title"
            :subtitle="group.subtitle"
            :preview="3"
            :data-visibility-id="workout.id"
            :data-title="blockName(group.block)"
            :data-subtitle="weekName(group.week)"
            v-intersect="{
              on: (visible: boolean) => (titleVisibilities[workout.id] = visible),
              options: { rootMargin: titleIntersectionRootMargin }
            }"
            @click="zoomIn(Scale.All, group.videos[0])"
          ></PVideoListGroup>
        </div>
      </div>
    </template>
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
