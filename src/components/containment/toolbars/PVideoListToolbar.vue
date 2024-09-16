<script setup lang="ts">
export type PVideoListToolbarProps = {
  title: string
}

const props = defineProps<PVideoListToolbarProps>()
</script>

<template>
  <nav class="navbar">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">{{ props.title || '&nbsp;' }}</a>
    </div>
  </nav>
</template>
