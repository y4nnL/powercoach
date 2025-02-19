<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { type Message, Scale, type Video, type VideoControl } from '@/types'
import PScaleButtonGroup from '@/components/containment/buttons/PScaleButtonGroup.vue'
import PControlGroup from '@/components/controls/PControlGroup.vue'
import PDateRangeControl from '@/components/controls/PDateRangeControl.vue'

export type PVideoListControlsProps = {
  scale: Scale
  videos: Video[]
}

const model = defineModel<VideoControl>({ required: true })

const props = defineProps<PVideoListControlsProps>()

const emit = defineEmits<{
  submit: [scale: Scale, videos: Video[]]
}>()

const localScale = ref<Scale>(props.scale)
const localModel = ref<VideoControl>({ ...model.value })

const canSubmit = computed<boolean>(
  () => JSON.stringify(model.value) !== JSON.stringify(localModel.value)
)

const { t } = useI18n<{ message: Message }>()

const submit = () => {
  emit('submit', props.scale, props.videos)
}
</script>

<template>
  <div class="p-3">
    <PControlGroup :title="t('PVideosListControl_title_scale')">
      <PScaleButtonGroup class="w-100" v-model:scale="localScale"></PScaleButtonGroup>
    </PControlGroup>
    <PControlGroup :title="t('PVideosListControl_title_date')">
      <PDateRangeControl
        v-model:from-date="localModel.fromDate"
        v-model:to-date="localModel.toDate"
      ></PDateRangeControl>
    </PControlGroup>
    <div class="d-grid gap-2 mt-5">
      <button class="btn btn-primary" :disabled="!canSubmit" @click="submit">Filtrer</button>
      <button class="btn btn-secondary text-black">Annuler</button>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
