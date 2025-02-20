<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import PIcon from '@/components/icons/PIcon.vue'

const container = ref<HTMLElement | null>(null)

defineExpose({ container })
</script>

<template>
  <nav class="navbar navbar-expand p-1" ref="container">
    <div class="PBottomNavigationCollapse collapse navbar-collapse">
      <ul class="navbar-nav w-100 justify-content-around">
        <li class="nav-item">
          <RouterLink class="nav-link" :active-class="'active'" to="/">
            <PIcon path="mdiHome" :size="30" />
          </RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink class="nav-link" :active-class="'active'" to="/videos">
            <PIcon path="mdiVideo" :size="30" />
          </RouterLink>
        </li>
      </ul>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
.PBottomNavigationCollapse {
  margin-bottom: var(--p-area-bottom);
}
</style>
