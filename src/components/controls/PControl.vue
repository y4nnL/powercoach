<script setup lang="ts">
import PIcon from '@/components/icons/PIcon.vue'

export type PControlProps = {
  clearable?: boolean
}

const props = defineProps<PControlProps>()

const model = defineModel<unknown>({ required: true })

const emit = defineEmits<{
  click: []
  'update:modelValue': [modelValue: undefined]
}>()
</script>

<template>
  <div class="PControl d-flex gap-2" @click="emit('click')">
    <span class="me-auto">
      <slot name="label"></slot>
    </span>
    <strong v-if="model" class="text-dark">
      <slot name="value">-</slot>
    </strong>
    <em v-else class="text-dark">
      <slot name="fallback">-</slot>
    </em>
    <PIcon
      v-if="props.clearable && typeof model !== 'undefined'"
      path="mdiClose"
      @click.stop="emit('update:modelValue', undefined)"
    ></PIcon>
  </div>
</template>
