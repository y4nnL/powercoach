<script setup lang="ts">
import VueIcon, { type MDI } from '@jamescoyle/vue-icon'
import * as mdiJs from '@mdi/js'

export type PIconProps = {
  path: keyof MDI
  size?: number
}

const props = withDefaults(defineProps<PIconProps>(), { size: 24 })
</script>

<template>
  <VueIcon type="mdi" :path="mdiJs[props.path]" :size="props.size" />
</template>
