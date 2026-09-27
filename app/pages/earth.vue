<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <main class="destination-page">
    <p class="destination-page__eyebrow">{{ t('earth.eyebrow') }}</p>
    <h1 class="destination-page__title font-moon-flower">{{ t('earth.title') }}</h1>
  </main>
</template>

<style scoped>
.destination-page {
  display: grid;
  min-height: 100dvh;
  align-content: center;
  justify-items: center;
  padding: 6rem 2rem 2rem;
  text-align: center;
}

.destination-page__eyebrow {
  margin: 0 0 0.6rem;
  font-size: 0.75rem;
  letter-spacing: 0.16em;
  opacity: 0.55;
  text-transform: uppercase;
}

.destination-page__title {
  max-width: 12ch;
  margin: 0;
  font-size: clamp(3rem, 8vw, 7rem);
  font-weight: 400;
  line-height: 0.9;
}
</style>
