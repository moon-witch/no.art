<script setup lang="ts">
import BubbleNavigation from '~/components/navigation/BubbleNavigation.vue'
import LanguageSwitcher from '~/components/navigation/LanguageSwitcher.vue'
import StudioLoginModal from '~/components/studio/StudioLoginModal.vue'

const route = useRoute()
const isStudioRoute = computed(() => route.path.startsWith('/studio'))
</script>

<template>
  <div class="app-shell">
    <BubbleNavigation v-if="!isStudioRoute" />
    <LanguageSwitcher v-if="!isStudioRoute" />
    <NuxtPage :transition="{ name: 'scene', mode: 'out-in' }" />
    <StudioLoginModal />
  </div>
</template>

<style>
.scene-leave-active,
.scene-enter-active {
  transition:
      opacity 650ms cubic-bezier(.4, 0, .2, 1),
      filter 650ms cubic-bezier(.4, 0, .2, 1),
      transform 650ms cubic-bezier(.4, 0, .2, 1);
}

.scene-leave-to {
  opacity: 0;
  filter: blur(6px);
  transform: translateY(5dvh) scale(0.985);
}

.scene-enter-from {
  opacity: 0;
  filter: blur(6px);
  transform: translateY(-5dvh) scale(0.985);
}

@media (prefers-reduced-motion: reduce) {
  .scene-leave-active,
  .scene-enter-active {
    transition: opacity 150ms linear;
  }

  .scene-leave-to,
  .scene-enter-from {
    filter: none;
    transform: none;
  }
}
</style>
