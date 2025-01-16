<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { type Message, Scale } from '@/types'
import PScaleButtonGroup from '@/components/containment/buttons/PScaleButtonGroup.vue'
import PControl from '@/components/controls/PControl.vue'

const scale = defineModel<Scale>('scale', { required: true })
const newScale = ref<Scale>(scale.value)

const emit = defineEmits<{
  'update:controls': [controls: number]
}>()

const { t } = useI18n<{ message: Message }>()
</script>

<template>
  <div class="p-3">
    <PControl :title="t('PVideosListControl_title_scale')">
      <PScaleButtonGroup class="w-100" v-model:scale="newScale"></PScaleButtonGroup>
    </PControl>
    <PControl :title="t('PVideosListControl_title_date')"> </PControl>
  </div>
</template>

<style scoped lang="scss"></style>
