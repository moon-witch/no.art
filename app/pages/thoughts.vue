<script setup lang="ts">
import PageHeadline from '~/components/typography/PageHeadline.vue'

type Thought = {
  id: string
  quoteText: string
  attribution: string
  reflection: Record<'en' | 'de', string>
  imageAlt: string
  imageAssetId: string
}

const { t, locale } = useI18n()
const headline = computed(() => t('navigation.thoughts.label').toUpperCase())
const { data: thoughts } = await useFetch<Thought[]>('/api/thoughts', { default: () => [] })
const activeId = ref<string | null>(null)
const cueId = ref<string | null>(null)
const viewport = reactive({ width: 0, height: 0 })
const sceneSeed = ref('')
const prefersReducedMotion = ref(false)
let cueTimer: ReturnType<typeof setTimeout> | undefined
let cueCycle = 0

const hash = (value: string) => Array.from(value).reduce((total, character) => ((total << 5) - total) + character.charCodeAt(0), 0) >>> 0
const seeded = (id: string, offset: number) => (hash(`${sceneSeed.value}:${id}:${offset}`) % 10_000) / 10_000

const positionFor = (thought: Thought) => {
  const compact = viewport.width < 640
  const x = (compact ? 10 : 7) + seeded(thought.id, 1) * (compact ? 80 : 86)
  const y = (compact ? 20 : 13) + seeded(thought.id, 2) * (compact ? 63 : 74)
  const size = (compact ? 4.8 : 5.5) + seeded(thought.id, 3) * (compact ? 3.6 : 6)
  const horizontalDistance = ((x / 100) - 0.5) * viewport.width
  const verticalDistance = ((y / 100) - 0.5) * viewport.height
  const distance = Math.hypot(horizontalDistance, verticalDistance) || 1
  const yieldRange = compact ? 210 : 300
  const influence = activeId.value && thought.id !== activeId.value ? Math.max(0, 1 - (distance / yieldRange)) : 0
  const yieldDistance = influence * (compact ? 24 : 38)

  return {
    '--thought-x': `${x}%`,
    '--thought-y': `${y}%`,
    '--thought-size': `${size}rem`,
    '--yield-x': `${(horizontalDistance / distance) * yieldDistance}px`,
    '--yield-y': `${(verticalDistance / distance) * yieldDistance}px`,
  }
}

const activeThought = computed(() => thoughts.value.find(thought => thought.id === activeId.value))
const toggleThought = (id: string) => { activeId.value = activeId.value === id ? null : id }
const updateViewport = () => { viewport.width = window.innerWidth; viewport.height = window.innerHeight }

const clearCue = () => {
  if (cueTimer) clearTimeout(cueTimer)
  cueTimer = undefined
  cueId.value = null
}

const scheduleCue = () => {
  clearCue()
  if (prefersReducedMotion.value || document.hidden || activeId.value || !thoughts.value.length) return

  const index = Math.floor(seeded('cue', cueCycle++) * thoughts.value.length)
  cueTimer = setTimeout(() => {
    if (document.hidden || activeId.value) return
    cueId.value = thoughts.value[index]?.id ?? null
    cueTimer = setTimeout(scheduleCue, 1800)
  }, 4800 + Math.floor(seeded('cue-delay', cueCycle) * 3200))
}

const onVisibilityChange = () => scheduleCue()

onMounted(() => {
  const storedSeed = sessionStorage.getItem('stay-a-while-thoughts-seed')
  sceneSeed.value = storedSeed || crypto.randomUUID()
  sessionStorage.setItem('stay-a-while-thoughts-seed', sceneSeed.value)
  updateViewport()
  prefersReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.addEventListener('resize', updateViewport)
  document.addEventListener('visibilitychange', onVisibilityChange)
  scheduleCue()
})

watch(activeId, scheduleCue)

onBeforeUnmount(() => {
  clearCue()
  window.removeEventListener('resize', updateViewport)
  document.removeEventListener('visibilitychange', onVisibilityChange)
})
</script>

<template>
  <main class="thoughts-page" tabindex="-1" @keyup.esc="activeId = null">
    <button
      v-for="thought in thoughts"
      :key="thought.id"
      class="thoughts-page__image"
      :class="{
        'thoughts-page__image--active': activeId === thought.id,
        'thoughts-page__image--cue': cueId === thought.id,
      }"
      :style="positionFor(thought)"
      type="button"
      :aria-pressed="activeId === thought.id"
      :aria-label="`${thought.quoteText} — ${thought.attribution}`"
      @click="toggleThought(thought.id)"
    >
      <img :src="`/api/assets/${thought.imageAssetId}`" :alt="thought.imageAlt">
    </button>

    <Transition name="thought-panel">
      <article v-if="activeThought" class="thoughts-page__panel" aria-live="polite">
        <blockquote class="font-simple-handmade">“{{ activeThought.quoteText }}”</blockquote>
        <cite class="font-moon-flower">— {{ activeThought.attribution }}</cite>
        <p>{{ activeThought.reflection[locale] || activeThought.reflection.en }}</p>
      </article>
    </Transition>
    <PageHeadline :text="headline" />
  </main>
</template>

<style scoped>
.thoughts-page { position: relative; height: 100dvh; overflow: hidden; }
.thoughts-page__image { position: absolute; top: var(--thought-y); left: var(--thought-x); z-index: 1; width: var(--thought-size); aspect-ratio: 1; overflow: hidden; padding: 0; border: 1px solid rgb(255 255 255 / 42%); border-radius: 48% 52% 51% 49% / 51% 47% 53% 49%; background: rgb(255 255 255 / 6%); box-shadow: 0 0 1.2rem rgb(195 167 255 / 20%); cursor: pointer; transform: translate(calc(-50% + var(--yield-x, 0px)), calc(-50% + var(--yield-y, 0px))); transition: top 800ms cubic-bezier(.16, 1, .3, 1), left 800ms cubic-bezier(.16, 1, .3, 1), width 700ms cubic-bezier(.16, 1, .3, 1), transform 850ms cubic-bezier(.16, 1, .3, 1), box-shadow 600ms ease, border-radius 6s ease-in-out; }
.thoughts-page__image:hover, .thoughts-page__image:focus-visible { outline: none; box-shadow: 0 0 2rem rgb(207 183 255 / 50%); transform: translate(calc(-50% + var(--yield-x, 0px)), calc(-50% + var(--yield-y, 0px))) scale(1.08); }
.thoughts-page__image img { width: 100%; height: 100%; object-fit: cover; }
.thoughts-page__image--active { top: 50%; left: 50%; z-index: 3; width: min(32vw, 16rem); transform: translate(-50%, -50%); }
.thoughts-page__image--cue { animation: thought-anomaly 1800ms cubic-bezier(.16, 1, .3, 1); }
.thoughts-page__panel { position: absolute; z-index: 2; top: calc(50% + min(14rem, 28vw)); left: 50%; width: min(32rem, calc(100vw - 3rem)); text-align: center; transform: translateX(-50%); }
.thoughts-page__panel blockquote { margin: 0; font-size: clamp(1.8rem, 4vw, 3rem); line-height: 1; }.thoughts-page__panel cite { font-style: normal; font-size: 1.35rem; opacity: .8; }.thoughts-page__panel p { margin: 1rem auto 0; max-width: 50ch; }
.thought-panel-enter-active, .thought-panel-leave-active { transition: opacity 350ms ease, transform 550ms cubic-bezier(.16, 1, .3, 1); }.thought-panel-enter-from, .thought-panel-leave-to { opacity: 0; transform: translate(-50%, -1rem); }
@keyframes thought-anomaly { 0%, 100% { box-shadow: 0 0 1.2rem rgb(195 167 255 / 20%); } 35% { box-shadow: 0 0 2.7rem rgb(220 189 255 / 64%); transform: translate(calc(-50% + var(--yield-x, 0px)), calc(-50% + var(--yield-y, 0px))) scale(1.09); } }
@media (max-width: 640px) { .thoughts-page__image--active { width: min(52vw, 13rem); }.thoughts-page__panel { top: calc(50% + min(11rem, 30vw)); }.thoughts-page__panel p { font-size: .9rem; } }
@media (prefers-reduced-motion: reduce) { .thoughts-page__image, .thoughts-page__image--cue, .thought-panel-enter-active, .thought-panel-leave-active { animation: none; transition-duration: 120ms; } }
</style>
