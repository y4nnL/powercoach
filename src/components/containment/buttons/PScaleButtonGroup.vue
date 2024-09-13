<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Scale } from '@/types'

type PScaleButtonGroupProps = {
  allMessage?: string
  scales?: Scale[]
}

const { t } = useI18n()

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
      v-for="(scale, index) in props.scales"
      type="button"
      class="btn"
      :key="scale"
      :class="{
        'rounded-start-pill': !index,
        'rounded-end-pill': index === props.scales.length - 1,
        'btn-primary': scaleModel === scale,
        'btn-secondary': scaleModel !== scale
      }"
      @click="emit('update:scale', scale)"
    >
      <span v-if="scale === Scale.All && props.allMessage">{{ props.allMessage }}</span>
      <span v-else>{{ t(`common_${scale}`) }}</span>
    </button>
  </div>
</template>
