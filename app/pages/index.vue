<script setup lang="ts">
import TextReveal from '~/components/animations/TextReveal.vue'
import TextRevealLoop from '~/components/animations/TextRevealLoop.vue'
import FlowerOfLife from '~/components/decorations/FlowerOfLife.vue'

const revealDuration = 650
const letterDelay = 65
const initialDelay = 100
const lingerDuration = 1500
const { t } = useI18n()
const headline = computed(() => t('home.headline'))
const subheadline = computed(() => t('home.subheadline'))
const loopWords = computed(() => [
  t('home.loopWords.see'),
  t('home.loopWords.read'),
  t('home.loopWords.find'),
  t('home.loopWords.hear'),
])

const hasHomeIntroPlayed = useHomeIntroPlayed()
const shouldPlayIntro = ref(!hasHomeIntroPlayed.value)
const isSettled = ref(hasHomeIntroPlayed.value)
const isSettling = ref(false)
const homeNavigationReady = useHomeScene()
let settleTimer: ReturnType<typeof setTimeout> | undefined
let settleMotionTimer: ReturnType<typeof setTimeout> | undefined

onMounted(() => {
  if (!shouldPlayIntro.value) {
    homeNavigationReady.value = true

    return
  }

  hasHomeIntroPlayed.value = true
  homeNavigationReady.value = false

  const finalLetterDelay = (Array.from(headline.value).length - 1) * letterDelay
  const revealCompleteAt = initialDelay + finalLetterDelay + revealDuration

  settleTimer = setTimeout(() => {
    isSettled.value = true
    isSettling.value = true
    homeNavigationReady.value = true

    settleMotionTimer = setTimeout(() => {
      isSettling.value = false
    }, 1700)
  }, revealCompleteAt + lingerDuration)
})

onBeforeUnmount(() => {
  if (settleTimer) {
    clearTimeout(settleTimer)
  }

  if (settleMotionTimer) {
    clearTimeout(settleMotionTimer)
  }
})
</script>

<template>
  <main class="home-page">
    <FlowerOfLife />

    <h1
        class="home-page__headline font-moon-flower"
        :class="{ 'home-page__headline--settled': isSettled }"
    >
      <TextReveal
          v-if="shouldPlayIntro"
          :text="headline"
          :delay="letterDelay"
          :initial-delay="initialDelay"
          :reveal-duration="revealDuration"
          :settling="isSettling"
          :settle-delay="42"
      />
      <span v-else>{{ headline }}</span>
    </h1>

    <p
        class="home-page__subheadline font-moon-flower"
        :class="{ 'home-page__subheadline--settled': isSettled }"
    >
      <TextReveal
          :text="subheadline"
          :delay="42"
          :initial-delay="900"
          :reveal-duration="550"
          :settling="isSettling"
          :settle-delay="28"
      />
      <TextRevealLoop
        :texts="loopWords"
          :delay="50"
          :initial-delay="2200"
          :reveal-duration="550"
          :hold-duration="2800"
          :settling="isSettling"
          :settle-delay="35"
      />
    </p>

    <section
        class="home-page__introduction"
        :class="{ 'home-page__introduction--visible': isSettled }"
        :aria-label="t('home.introductionLabel')"
    >
      <FlowerOfLife
          class="home-page__introduction-pattern"
          line-opacity="35%"
      />
      <p class="font-simple-handmade">
        {{ t('home.introduction') }}
      </p>
    </section>
  </main>
</template>

<style scoped>
.home-page {
  --settle-easing: cubic-bezier(.65, 0, .35, 1);
  --center-circle-size: min(48vw, 29rem);

  position: relative;
  height: 100dvh;
  overflow: hidden;
}

.home-page__headline {
  position: absolute;
  left: 50%;
  bottom: 50%;
  margin: 0;
  white-space: nowrap;
  font-size: clamp(3rem, 4vw, 7rem);
  font-weight: 300;
  line-height: 0.9;
  transform: translate(-50%, calc(50% - 0.55em));
  transition:
      left 1550ms var(--settle-easing),
      bottom 1550ms var(--settle-easing),
      transform 1550ms var(--settle-easing);
  will-change: bottom, transform;
  z-index: 2;
}

.home-page__headline--settled {
  left: calc(50% - 1.25rem);
  bottom: clamp(1.5rem, 4.5dvh, 4rem);
  transform: translateX(-100%);
}

.home-page__subheadline {
  position: absolute;
  left: 50%;
  bottom: 50%;
  margin: 0;
  white-space: nowrap;
  font-size: clamp(1.75rem, 2.5vw, 3.75rem);
  font-weight: 300;
  line-height: 0.95;
  text-align: center;
  transform: translate(-50%, calc(50% + 1.05em));
  transition:
      left 1550ms var(--settle-easing),
      bottom 1550ms var(--settle-easing),
      transform 1550ms var(--settle-easing);
  will-change: left, bottom, transform;
  z-index: 2;
}

.home-page__subheadline--settled {
  left: calc(50% + 1.25rem);
  bottom: clamp(1.9rem, 5.3dvh, 4.3rem);
  transform: translateX(0);
}

.home-page__introduction {
  position: absolute;
  z-index: 1;
  top: 50%;
  left: 50%;
  display: grid;
  width: var(--center-circle-size);
  aspect-ratio: 1;
  place-items: center;
  padding: 3rem;
  border: 1px solid rgb(255 255 255 / 42%);
  box-shadow: inset 0 0 40px 0px rgb(255 255 255 / 42%), 0 0 20px 0px rgb(255 255 255 / 42%);
  border-radius: 50%;
  background: rgb(0 0 0 / 92%);
  overflow: hidden;
  color: rgb(255 255 255 / 76%);
  font-size: clamp(1rem, 1.8vw, 1.35rem);
  line-height: 1.35;
  text-align: center;
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.9);
  transition:
      opacity 900ms ease 250ms,
      transform 1200ms cubic-bezier(.16, 1, .3, 1) 250ms;
  pointer-events: none;
}

.home-page__introduction p {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 34ch;
  margin: 0;
  white-space: pre-line;
}

.home-page__introduction-pattern {
  filter: blur(3px);
  opacity: 0.95;
  transform: scale(1.025);
}

.home-page__introduction--visible {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
}

@media (prefers-reduced-motion: reduce) {
  .home-page__headline {
    left: calc(50% - 1.25rem);
    bottom: clamp(1.5rem, 5dvh, 4rem);
    transform: translateX(-100%);
    transition: none;
  }

  .home-page__subheadline {
    left: calc(50% + 1.25rem);
    bottom: clamp(1.9rem, 5.3dvh, 4.3rem);
    transform: translateX(0);
    transition: none;
  }
}

@media (max-width: 640px) {
  .home-page {
    --center-circle-size: min(70vw, 21rem);
  }

  .home-page__headline {
    font-size: clamp(2.3rem, 11vw, 3.5rem);
  }

  .home-page__headline--settled {
    left: 1.25rem;
    transform: translateX(0);
  }

  .home-page__subheadline {
    width: 42vw;
    white-space: normal;
    font-size: clamp(1.1rem, 4.7vw, 1.5rem);
    text-align: left;
  }

  .home-page__subheadline--settled {
    left: 53%;
  }

  .home-page__introduction {
    width: var(--center-circle-size);
    padding: 2rem;
    font-size: 1rem;
  }
}
</style>
