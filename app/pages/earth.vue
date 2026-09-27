<script setup lang="ts">
import UniverseBackdrop from '~/components/decorations/UniverseBackdrop.vue'
import PageHeadline from '~/components/typography/PageHeadline.vue'

const { t } = useI18n()
const headline = computed(() => t('navigation.earth.label').toUpperCase())
</script>

<template>
  <main class="destination-page">
    <UniverseBackdrop />
    <PageHeadline :text="headline" />
  </main>
</template>

<style scoped>
.destination-page {
  position: relative;
  display: grid;
  height: 100dvh;
  box-sizing: border-box;
  align-content: center;
  justify-items: center;
  padding: 6rem 2rem 2rem;
  text-align: center;
  overflow: hidden;
}

</style>
