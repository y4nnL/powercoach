<script setup lang="ts">
import { watch } from 'vue'
import moment from 'moment/moment'

import { DatePicker } from '@capacitor-community/date-picker'

const date = defineModel<Date | undefined>('date', { required: true })
const show = defineModel<boolean>('show', { required: true })

const emit = defineEmits<{
  'update:date': [date: Date | undefined]
  'update:show': [boolean]
}>()

watch(
  () => show.value,
  () => {
    if (show.value) {
      DatePicker.present({
        mode: 'date',
        locale: 'fr_FR',
        date: moment(date.value).format('DD/MM/YYYY'),
        theme: 'dark',
        ios: { format: 'dd/MM/YYYY' }
      }).then((newDate) => {
        emit('update:show', false)
        emit('update:date', new Date(newDate.value))
      })
    }
  }
)
</script>
