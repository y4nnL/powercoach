<script setup lang="ts" generic="T extends UseQueryReturnType<unknown, unknown>">
import type { UseQueryReturnType } from '@tanstack/vue-query'
import { type UnwrapRef } from 'vue'

type Data = NonNullable<UnwrapRef<T['data']>>

const props = defineProps<{
  query: T
}>()

defineSlots<{
  pending(): void
  default(props: { data: Data }): void
}>()

const { data, isPending } = props.query
</script>

<template>
  <template v-if="isPending">
    <slot name="pending">
      <div class="h-100 d-flex flex-column justify-content-center align-items-center">
        <span class="spinner-border text-light" aria-hidden="true"></span>
      </div>
    </slot>
  </template>
  <slot v-else-if="data" :data="data as Data" />
</template>
