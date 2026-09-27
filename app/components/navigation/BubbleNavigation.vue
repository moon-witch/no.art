<script setup lang="ts">
const route = useRoute()
const homeNavigationReady = useHomeScene()
const { t } = useI18n()

const navigation = computed(() => [
  {
    id: 'thoughts',
    label: t('navigation.thoughts.label'),
    description: t('navigation.thoughts.description'),
    to: '/thoughts',
  },
  {
    id: 'earth',
    label: t('navigation.earth.label'),
    description: t('navigation.earth.description'),
    to: '/earth',
  },
])

const activePage = computed(() => route.path.slice(1))
const isHome = computed(() => route.path === '/')
const isVisible = computed(() => !isHome.value || homeNavigationReady.value)
</script>

<template>
  <nav
      class="bubble-navigation"
      :class="[
        `bubble-navigation--${isHome ? 'home' : activePage}`,
        { 'bubble-navigation--visible': isVisible },
      ]"
      :aria-label="t('navigation.label')"
  >
    <Transition name="home-control">
      <NuxtLink
          v-if="!isHome"
          to="/"
          class="bubble-navigation__home"
      >
        <span aria-hidden="true">←</span>
        <span>{{ t('navigation.home') }}</span>
      </NuxtLink>
    </Transition>

    <NuxtLink
        v-for="item in navigation"
        :key="item.id"
        :to="item.to"
        class="bubble-navigation__item font-simple-handmade"
        :class="[
          `bubble-navigation__item--${item.id}`,
          { 'bubble-navigation__item--active': activePage === item.id },
        ]"
        :aria-current="activePage === item.id ? 'page' : undefined"
    >
      <span class="bubble-navigation__bubble" aria-hidden="true">
        <span class="bubble-navigation__label">{{ item.label }}</span>
      </span>
      <span class="bubble-navigation__description">{{ item.description }}</span>
    </NuxtLink>
  </nav>
</template>

<style scoped>
.bubble-navigation {
  position: fixed;
  inset: 0;
  z-index: 10;
  pointer-events: none;
  opacity: 0;
  transition: opacity 500ms ease;
}

.bubble-navigation--visible {
  opacity: 1;
}

.bubble-navigation__item {
  --bubble-size: clamp(7rem, 12vw, 11rem);

  position: absolute;
  width: 0;
  height: 0;
  color: inherit;
  text-align: center;
  text-decoration: none;
  pointer-events: auto;
  transition:
      top 1300ms cubic-bezier(.65, 0, .35, 1),
      left 1300ms cubic-bezier(.65, 0, .35, 1),
      transform 1300ms cubic-bezier(.65, 0, .35, 1),
      opacity 450ms ease;
}

.bubble-navigation__home {
  position: absolute;
  top: 2.4rem;
  right: 2.4rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.48rem 0.58rem;
  color: inherit;
  font-family: 'Moon Flower', cursive;
  font-size: 1.25rem;
  line-height: 1;
  text-decoration: none;
  text-align: center;
  isolation: isolate;
  pointer-events: auto;
  transition:
      transform 250ms ease;
}

.bubble-navigation__home span {
  position: relative;
  z-index: 1;
}

.bubble-navigation__home::before,
.bubble-navigation__home::after {
  position: absolute;
  inset: 0;
  z-index: 0;
  content: '';
  pointer-events: none;
}

.bubble-navigation__home::before {
  border-radius: 49% 51% 47% 53% / 52% 47% 53% 48%;
  background:
      radial-gradient(ellipse at 30% 25%, rgb(255 255 255 / 14%), transparent 38%),
      rgb(255 255 255 / 12%);
  box-shadow: inset 0 0 0.7rem rgb(255 255 255 / 8%);
  transition: opacity 250ms ease, transform 250ms ease;
}

.bubble-navigation__home::after {
  display: none;
}

.bubble-navigation__home:hover,
.bubble-navigation__home:focus-visible {
  outline: none;
  transform: translateY(-2px);
}

.bubble-navigation__home:hover::before,
.bubble-navigation__home:focus-visible::before {
  opacity: 1;
  transform: scale(1.04, 0.94);
}

.home-control-enter-active,
.home-control-leave-active {
  transition: opacity 350ms ease;
}

.home-control-enter-from,
.home-control-leave-to {
  opacity: 0;
}

.bubble-navigation__bubble {
  position: relative;
  top: 0;
  left: 0;
  isolation: isolate;
  display: grid;
  width: var(--bubble-size);
  aspect-ratio: 1;
  place-items: center;
  border: 1px solid rgb(255 255 255 / 42%);
  border-radius: 50%;
  background:
      radial-gradient(circle at 31% 26%, rgb(255 255 255 / 34%), transparent 12%),
      radial-gradient(circle at 70% 72%, rgb(158 121 255 / 18%), transparent 46%),
      rgb(255 255 255 / 5%);
  box-shadow:
      inset 0 0 1.2rem rgb(255 255 255 / 16%),
      0 0 1.8rem rgb(151 110 255 / 13%);
  backdrop-filter: blur(3px);
  overflow: hidden;
  transform: var(--bubble-position, translate(-50%, -50%)) scale(var(--bubble-hover-scale, 1));
  animation: bubble-distort var(--bubble-distort-duration, 8s) ease-in-out infinite alternate;
  transition:
      width 1300ms cubic-bezier(.65, 0, .35, 1),
      border-color 300ms ease,
      box-shadow 300ms ease,
      transform 1300ms cubic-bezier(.65, 0, .35, 1);
}

.bubble-navigation__label {
  position: relative;
  z-index: 1;
  font-family: 'Moon Flower', cursive;
  font-size: clamp(1.9rem, 3vw, 3rem);
  line-height: 1;
  transition: font-size 1300ms cubic-bezier(.65, 0, .35, 1);
}

.bubble-navigation__bubble::before,
.bubble-navigation__bubble::after {
  position: absolute;
  inset: -35%;
  z-index: 0;
  content: '';
  pointer-events: none;
}

.bubble-navigation__bubble::before {
  background:
      radial-gradient(ellipse at 30% 25%, rgb(255 255 255 / 36%), transparent 17%),
      linear-gradient(120deg, transparent 36%, rgb(184 150 255 / 19%) 49%, transparent 63%);
  opacity: 0.48;
  transform: translate(-12%, -8%) rotate(-12deg);
  animation: bubble-shimmer var(--bubble-shimmer-duration, 6s) cubic-bezier(.45, 0, .55, 1) infinite alternate;
}

.bubble-navigation__bubble::after {
  background: conic-gradient(
      from 140deg,
      transparent 0deg,
      rgb(113 204 255 / 11%) 58deg,
      transparent 116deg,
      rgb(214 159 255 / 12%) 210deg,
      transparent 270deg
  );
  opacity: 0.42;
  animation: bubble-refraction var(--bubble-refraction-duration, 11s) linear infinite;
}

.bubble-navigation__item--thoughts .bubble-navigation__bubble {
  --bubble-distort-duration: 8.5s;
  --bubble-shimmer-duration: 6.8s;
  --bubble-refraction-duration: 12s;
}

.bubble-navigation__item--earth .bubble-navigation__bubble {
  --bubble-distort-duration: 10.2s;
  --bubble-shimmer-duration: 8.1s;
  --bubble-refraction-duration: 14.4s;
}

.bubble-navigation__description {
  position: absolute;
  top: calc((var(--bubble-size) / 2) + 0.7rem);
  left: 0;
  width: min(15rem, 38vw);
  font-size: 1.1rem;
  line-height: 1.25;
  opacity: 0.72;
  transform: translateX(-50%);
  transition:
      top 1300ms cubic-bezier(.65, 0, .35, 1),
      opacity 300ms ease,
      transform 300ms ease;
}

.bubble-navigation__item:hover .bubble-navigation__bubble,
.bubble-navigation__item:focus-visible .bubble-navigation__bubble {
  border-color: rgb(255 255 255 / 75%);
  box-shadow:
      inset 0 0 1.6rem rgb(255 255 255 / 26%),
      0 0 2.5rem rgb(176 138 255 / 28%);
  --bubble-hover-scale: 1.045;
}

.bubble-navigation__item:focus-visible {
  outline: none;
}

.bubble-navigation__item--thoughts {
  top: 26%;
  left: 20%;
}

.bubble-navigation__item--earth {
  top: 67%;
  left: 78%;
}

.bubble-navigation--thoughts .bubble-navigation__item--thoughts,
.bubble-navigation--earth .bubble-navigation__item--earth {
  top: 2rem;
  left: 2rem;
  transform: translate(0);
}

.bubble-navigation--thoughts .bubble-navigation__item--thoughts .bubble-navigation__bubble,
.bubble-navigation--earth .bubble-navigation__item--earth .bubble-navigation__bubble,
.bubble-navigation--thoughts .bubble-navigation__item--earth .bubble-navigation__bubble,
.bubble-navigation--earth .bubble-navigation__item--thoughts .bubble-navigation__bubble {
  --bubble-position: translate(0);
}

.bubble-navigation--thoughts .bubble-navigation__item--earth,
.bubble-navigation--earth .bubble-navigation__item--thoughts {
  top: 2.35rem;
  left: calc(clamp(5.75rem, 10vw, 8.5rem) + 2.4rem);
  transform: translate(0);
}

.bubble-navigation--thoughts .bubble-navigation__item--active,
.bubble-navigation--earth .bubble-navigation__item--active {
  --bubble-size: clamp(4rem, 7vw, 5.75rem);
}

.bubble-navigation--thoughts .bubble-navigation__item--active .bubble-navigation__label,
.bubble-navigation--earth .bubble-navigation__item--active .bubble-navigation__label {
  font-size: clamp(1.15rem, 2.1vw, 1.55rem);
}

.bubble-navigation--thoughts .bubble-navigation__item:not(.bubble-navigation__item--active),
.bubble-navigation--earth .bubble-navigation__item:not(.bubble-navigation__item--active) {
  --bubble-size: clamp(3.2rem, 5vw, 4.25rem);

  opacity: 0.7;
}

.bubble-navigation--thoughts .bubble-navigation__item:not(.bubble-navigation__item--active) .bubble-navigation__label,
.bubble-navigation--earth .bubble-navigation__item:not(.bubble-navigation__item--active) .bubble-navigation__label {
  font-size: clamp(0.85rem, 1.5vw, 1.1rem);
}

.bubble-navigation--thoughts .bubble-navigation__description,
.bubble-navigation--earth .bubble-navigation__description {
  visibility: hidden;
  opacity: 0;
  transform: translate(-50%, -0.25rem);
}

@keyframes bubble-distort {
  0% {
    border-radius: 49% 51% 48% 52% / 52% 48% 52% 48%;
  }

  42% {
    border-radius: 54% 46% 53% 47% / 45% 55% 46% 54%;
  }

  70% {
    border-radius: 47% 53% 45% 55% / 55% 46% 54% 45%;
  }

  to {
    border-radius: 51% 49% 54% 46% / 48% 53% 47% 52%;
  }
}

@keyframes bubble-shimmer {
  to {
    opacity: 0.78;
    transform: translate(13%, 10%) rotate(15deg) scale(1.08);
  }
}

@keyframes bubble-refraction {
  to {
    transform: rotate(1turn) scale(1.08);
  }
}

@media (max-width: 640px) {
  .bubble-navigation__home {
    top: 1rem;
    right: 1rem;
    padding: 0.4rem 0.48rem;
    font-size: 1.05rem;
  }

  .bubble-navigation__item--thoughts {
    top: 25%;
    left: 20%;
  }

  .bubble-navigation__item--earth {
    top: 68%;
    left: 78%;
  }

  .bubble-navigation--thoughts .bubble-navigation__item--thoughts,
  .bubble-navigation--earth .bubble-navigation__item--earth {
    top: 1rem;
    left: 1rem;
  }

  .bubble-navigation--thoughts .bubble-navigation__item--earth,
  .bubble-navigation--earth .bubble-navigation__item--thoughts {
    top: 1.3rem;
    left: 5.7rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .bubble-navigation,
  .bubble-navigation__item,
  .bubble-navigation__bubble,
  .bubble-navigation__home,
  .bubble-navigation__label,
  .bubble-navigation__bubble::before,
  .bubble-navigation__bubble::after,
  .bubble-navigation__home::before,
  .bubble-navigation__home::after {
    transition: none;
    animation: none;
  }

  .home-control-enter-active,
  .home-control-leave-active {
    transition: none;
  }
}
</style>
