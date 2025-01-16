<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { type Message, Scale } from '@/types'

type PScaleButtonGroupProps = {
  allMessage?: string
  scales?: Scale[]
}

const { t } = useI18n<{ message: Message }>()

const props = withDefaults(defineProps<PScaleButtonGroupProps>(), {
  scales: () => [Scale.Block, Scale.Week, Scale.Workout, Scale.All]
})

const emit = defineEmits<{
  'update:scale': [Scale]
}>()

const scaleModel = defineModel<Scale>('scale', { required: true })
</script>

<template>
  <div class="btn-group">
    <button
      v-for="scale in props.scales"
      type="button"
      class="btn rounded-0"
      :key="scale"
      :class="{ 'btn-primary': scaleModel === scale, 'btn-dark': scaleModel !== scale }"
      @click="emit('update:scale', scale)"
    >
      <span>{{ t(`common_${scale}`) }}</span>
    </button>
  </div>
</template>
