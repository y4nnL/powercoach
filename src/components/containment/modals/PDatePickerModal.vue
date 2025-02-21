<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import VueDatePicker from '@vuepic/vue-datepicker'
import PModal from '@/components/containment/modals/PModal.vue'

export type PDatePickerModalProps = {
  minDate?: Date
  maxDate?: Date
}

const date = defineModel<Date | undefined>('date', { required: true })
const show = defineModel<boolean>('show', { required: true })

const props = defineProps<PDatePickerModalProps>()

const localDate = ref<Date | undefined>(date.value)

const emit = defineEmits<{
  'update:date': [date: Date | undefined]
  'update:show': [boolean]
}>()

const startDate = computed<Date | undefined>(() =>
  props.minDate ? props.minDate : props.maxDate ? props.maxDate : undefined
)

const close = () => emit('update:show', false)
const validate = () => {
  emit('update:date', localDate.value)
  close()
}

watchEffect(() => {
  localDate.value = date.value
})
</script>

<template>
  <PModal :show="show" @close="close">
    <div class="d-flex flex-column p-2 bg-white">
      <VueDatePicker
        v-model="localDate"
        :enable-time-picker="false"
        :min-date="props.minDate"
        :max-date="props.maxDate"
        :start-date="startDate"
        locale="fr-FR"
        auto-apply
        hide-offset-dates
        inline
        no-today
        prevent-min-max-navigation
        six-weeks
      ></VueDatePicker>
      <div class="d-flex justify-content-between">
        <button class="btn" @click="close">Cancel</button>
        <button class="btn btn-primary" @click="validate">Validate</button>
      </div>
    </div>
  </PModal>
</template>

<style lang="scss" scoped>
@import 'bootstrap/dist/css/bootstrap';
:deep(.dp__menu) {
  border: none;
  @extend .rounded-4;
}
</style>
