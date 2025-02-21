<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { Message } from '@/types'
import PDateControl from '@/components/controls/PDateControl.vue'

export type PDateRangeControlProps = {
  minDate?: Date
  maxDate?: Date
}

const props = defineProps<PDateRangeControlProps>()

const fromDate = defineModel<Date | undefined>('fromDate', { required: true })
const toDate = defineModel<Date | undefined>('toDate', { required: true })

const emit = defineEmits<{
  'update:fromDate': [date: Date | undefined]
  'update:toDate': [date: Date | undefined]
}>()

const { t } = useI18n<{ message: Message }>()
</script>

<template>
  <PDateControl v-model="fromDate" :min-date="props.minDate" :max-date="toDate ?? props.maxDate">
    <template #title>{{ t('PDateRangeControlProps_from') }}</template>
  </PDateControl>
  <PDateControl v-model="toDate" :min-date="fromDate ?? props.minDate" :max-date="props.maxDate">
    <template #title>{{ t('PDateRangeControlProps_to') }}</template>
  </PDateControl>
</template>
