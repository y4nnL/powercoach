<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import PIcon from '@/components/icons/PIcon.vue'

const container = ref<HTMLElement | null>(null)

defineExpose({ container })
</script>

<template>
  <nav class="PBottomNavigation navbar navbar-expand navbar-dark bg-dark" ref="container">
    <div class="collapse navbar-collapse">
      <ul class="navbar-nav w-100 justify-content-center">
        <li class="nav-item">
          <RouterLink class="nav-link" :active-class="'active'" to="/videos">
            <PIcon path="mdiVideo" />
          </RouterLink>
        </li>
      </ul>
    </div>
  </nav>
</template>

<style scoped>
.PBottomNavigation {
  padding-bottom: var(--safe-area-bottom);
}
</style>
