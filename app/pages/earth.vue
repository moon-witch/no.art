<script setup lang="ts">
import EarthGlobe from '~/components/earth/EarthGlobe.vue'
import UniverseBackdrop from '~/components/decorations/UniverseBackdrop.vue'
import PageHeadline from '~/components/typography/PageHeadline.vue'

type Country = { code: string, note: Record<string, string> }
type Marker = { id: string, countryCode: string, latitude: number, longitude: number, label: string | null, note: Record<string, string> }
type EarthData = { countries: Country[], markers: Marker[] }

const { t, locale } = useI18n()
const { data } = await useFetch<EarthData>('/api/earth', { default: () => ({ countries: [], markers: [] }) })
const selectedCountryCode = ref<string | null>(null)
const selectedMarkerId = ref<string | null>(null)
const headline = computed(() => t('navigation.earth.label').toUpperCase())
const selectedCountry = computed(() => data.value.countries.find(country => country.code === selectedCountryCode.value))
const selectedMarker = computed(() => data.value.markers.find(marker => marker.id === selectedMarkerId.value))
const selectedNote = computed(() => selectedMarker.value?.note?.[locale.value] || selectedMarker.value?.note?.en || selectedCountry.value?.note?.[locale.value] || selectedCountry.value?.note?.en)
const selectedLabel = computed(() => selectedMarker.value?.label || selectedCountry.value?.code)
const reset = () => {
  selectedCountryCode.value = null
  selectedMarkerId.value = null
}
</script>

<template>
  <main class="earth-page">
    <UniverseBackdrop />
    <ClientOnly>
      <EarthGlobe
        :countries="data.countries"
        :markers="data.markers"
        :active="Boolean(selectedCountryCode || selectedMarkerId)"
        @select-country="selectedCountryCode = $event; selectedMarkerId = null"
        @select-marker="selectedMarkerId = $event; selectedCountryCode = data.markers.find(marker => marker.id === $event)?.countryCode ?? null"
        @reset="reset"
      />
      <template #fallback>
        <div class="earth-page__fallback">{{ t('earth.title') }}</div>
      </template>
    </ClientOnly>

    <Transition name="earth-note">
      <aside v-if="selectedNote" class="earth-page__note">
        <button type="button" :aria-label="t('studio.close')" @click="reset">×</button>
        <p class="font-moon-flower">{{ selectedLabel }}</p>
        <p>{{ selectedNote }}</p>
      </aside>
    </Transition>
    <PageHeadline :text="headline" />
  </main>
</template>

<style scoped>
.earth-page { position: relative; height: 100dvh; overflow: hidden; }
.earth-page__fallback { position: absolute; z-index: 1; top: 50%; left: 50%; transform: translate(-50%, -50%); }
.earth-page__note { position: absolute; z-index: 4; top: clamp(6rem, 12vh, 9rem); right: clamp(1rem, 4vw, 4rem); width: min(20rem, calc(100vw - 2rem)); padding: 1.1rem 1.25rem; border: 1px solid rgb(191 224 255 / 53%); border-radius: 1rem; background: rgb(7 12 29 / 75%); box-shadow: 0 0 2rem rgb(91 176 255 / 16%); backdrop-filter: blur(10px); }
.earth-page__note button { position: absolute; top: .45rem; right: .6rem; border: 0; background: none; color: inherit; font-size: 1.35rem; cursor: pointer; }.earth-page__note p { margin: 0; }.earth-page__note p:first-of-type { margin-bottom: .45rem; font-size: 1.5rem; }.earth-note-enter-active, .earth-note-leave-active { transition: opacity 250ms ease, transform 450ms cubic-bezier(.16, 1, .3, 1); }.earth-note-enter-from, .earth-note-leave-to { opacity: 0; transform: translateY(-.75rem); }
@media (max-width: 640px) { .earth-page__note { top: 5.5rem; right: 1rem; left: 1rem; width: auto; } }
</style>
