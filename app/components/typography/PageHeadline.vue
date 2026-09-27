<script setup lang="ts">
import TextReveal from '~/components/animations/TextReveal.vue'

defineProps<{ text: string }>()
</script>

<template>
  <h1 class="page-headline font-moon-flower">
    <TextReveal
      :text="text"
      :delay="65"
      :initial-delay="220"
      :reveal-duration="650"
    />
  </h1>
</template>

<style scoped>
.page-headline {
  position: absolute;
  z-index: 5;
  bottom: clamp(1.5rem, 4.5dvh, 4rem);
  left: 50%;
  margin: 0;
  color: rgb(255 255 255 / 92%);
  font-size: clamp(3rem, 4vw, 7rem);
  font-weight: 300;
  line-height: .9;
  white-space: nowrap;
  transform: translateX(-50%);
}

@media (max-width: 640px) {
  .page-headline {
    bottom: 1.5rem;
    left: 50%;
    font-size: clamp(2.3rem, 11vw, 3.5rem);
    transform: translateX(-50%);
  }
}
</style>
