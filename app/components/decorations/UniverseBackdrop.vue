<script setup lang="ts">
import universeImage from '~/assets/images/earth-universe.png'
</script>

<template>
  <div
    class="universe-backdrop"
    aria-hidden="true"
  >
    <span
      class="universe-backdrop__image"
      :style="{ backgroundImage: `url(${universeImage})` }"
    />
    <span class="universe-backdrop__veil" />
  </div>
</template>

<style scoped>
.universe-backdrop {
  position: absolute;
  z-index: 0;
  inset: 0;
  overflow: hidden;
  background-color: #020106;
  pointer-events: none;
}

.universe-backdrop__image {
  position: absolute;
  inset: -0.8rem;
  background-position: center;
  background-size: cover;
  filter: blur(2.2px);
  opacity: .92;
  transform: scale(1.015);
}

.universe-backdrop__veil {
  position: absolute;
  inset: 0;
  background:
      radial-gradient(ellipse at 50% 48%, transparent 0 23%, rgb(3 2 9 / 17%) 61%, rgb(2 1 7 / 48%) 100%),
      linear-gradient(105deg, rgb(4 2 11 / 20%), transparent 45%, rgb(4 2 11 / 12%));
}

@media (max-width: 640px) {
  .universe-backdrop__image { background-position: 42% center; }
}

</style>
