<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Message } from '@/types'
import { useHumanReadability } from '@/composables/useHumanReadability'
import PDatePickerModal from '@/components/containment/modals/PDatePickerModal.vue'
import PControl from '@/components/controls/PControl.vue'

export type PDateControlProps = {
  minDate?: Date
  maxDate?: Date
}

const props = defineProps<PDateControlProps>()

const date = defineModel<Date | undefined>()

const emit = defineEmits<{
  'update:modelValue': [date: Date | undefined]
}>()

const show = ref<boolean>(false)

const { videoDate } = useHumanReadability()
const { t } = useI18n<{ message: Message }>()
</script>

<template>
  <PControl v-model="date" @click="show = true" clearable>
    <template #label>
      <slot name="title">{{ t('common_date') }}</slot>
    </template>
    <template #value>{{ date && videoDate({ date: date.toISOString() }) }}</template>
    <template #fallback>{{ t('PDateControl_none') }}</template>
  </PControl>
  <PDatePickerModal
    v-model:date="date"
    v-model:show="show"
    :min-date="props.minDate"
    :max-date="props.maxDate"
  ></PDatePickerModal>
</template>

<style lang="scss" scoped></style>
