<template>
  <transition name="fade-over">
    <slot></slot>
  </transition>
</template>

<style>
.fade-over-enter-active,
.fade-over-leave-active {
  transition: opacity 0.3s;
}
.fade-over-enter-active {
  position: absolute;
  top: 0;
  left: 0;
}
.fade-over-enter-from {
  opacity: 0 !important;
}
</style>
