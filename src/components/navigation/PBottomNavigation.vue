<script setup lang="ts">
import { RouterLink } from 'vue-router'
import PIcon from '@/components/icons/PIcon.vue'
</script>

<template>
  <nav class="navbar navbar-expand navbar-dark bg-dark">
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
