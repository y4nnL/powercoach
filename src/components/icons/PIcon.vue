<script setup lang="ts">
import { withDefaults } from 'vue'
import VueIcon, { type MDI } from '@jamescoyle/vue-icon'
import * as mdijs from '@mdi/js'

export type PIconProps = {
  path: keyof MDI
  size?: number
}

const props = withDefaults(defineProps<PIconProps>(), { size: 24 })
</script>

<template>
  <VueIcon type="mdi" :path="mdijs[props.path]" :size="props.size" />
</template>
