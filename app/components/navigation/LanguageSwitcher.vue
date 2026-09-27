<script setup lang="ts">
const { locale, setLocale, t } = useI18n()
const isSwitching = ref(false)
let switchTimer: ReturnType<typeof setTimeout> | undefined

const languages = [
  { code: 'en', label: 'EN', labelKey: 'navigation.switchToEnglish' },
  { code: 'de', label: 'DE', labelKey: 'navigation.switchToGerman' },
] as const

const changeLanguage = async (code: 'en' | 'de') => {
  if (locale.value !== code) {
    if (switchTimer) {
      clearTimeout(switchTimer)
    }

    isSwitching.value = true
    await setLocale(code)

    switchTimer = setTimeout(() => {
      isSwitching.value = false
    }, 740)
  }
}

onBeforeUnmount(() => {
  if (switchTimer) {
    clearTimeout(switchTimer)
  }
})
</script>

<template>
  <div
      class="language-switcher"
      :class="{ 'language-switcher--switching': isSwitching }"
      :aria-label="t('navigation.language')"
  >
    <span
        class="language-switcher__active-indicator"
        :class="`language-switcher__active-indicator--${locale}`"
        aria-hidden="true"
    />
    <button
        v-for="language in languages"
        :key="language.code"
        type="button"
        class="language-switcher__option"
        :class="{ 'language-switcher__option--active': locale === language.code }"
        :aria-label="t(language.labelKey)"
        :aria-pressed="locale === language.code"
        @click="changeLanguage(language.code)"
    >
      {{ language.label }}
    </button>
  </div>
</template>

<style scoped>
.language-switcher {
  position: fixed;
  top: 1.4rem;
  left: 50%;
  z-index: 20;
  display: inline-flex;
  gap: 0.1rem;
  transform: translateX(-50%);
}

.language-switcher__option {
  position: relative;
  z-index: 1;
  min-width: 1.85rem;
  padding: 0.36rem 0.3rem;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: rgb(255 255 255 / 48%);
  font-family: 'Moon Flower', cursive;
  font-size: 1.15rem;
  font-weight: 400;
  line-height: 1;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: color 250ms ease;
}

.language-switcher__option:hover,
.language-switcher__option:focus-visible {
  color: rgb(255 255 255 / 82%);
  outline: none;
}

.language-switcher__option--active {
  color: rgb(255 255 255 / 90%);
}

.language-switcher__active-indicator {
  position: absolute;
  top: 0.08rem;
  bottom: 0.08rem;
  left: 0;
  z-index: 0;
  width: calc((100% - 0.1rem) / 2);
  border-radius: 49% 51% 47% 53% / 52% 47% 53% 48%;
  background:
      radial-gradient(ellipse at 30% 25%, rgb(255 255 255 / 14%), transparent 38%),
      rgb(255 255 255 / 12%);
  box-shadow: inset 0 0 0.7rem rgb(255 255 255 / 8%);
  pointer-events: none;
  transition:
      transform 700ms cubic-bezier(.65, 0, .35, 1),
      border-radius 700ms cubic-bezier(.65, 0, .35, 1),
      opacity 250ms ease;
}

.language-switcher__active-indicator--en {
  transform: translateX(0) rotate(-1deg);
  border-radius: 51% 49% 47% 53% / 52% 46% 54% 48%;
}

.language-switcher__active-indicator--de {
  transform: translateX(calc(100% + 0.1rem)) rotate(1deg);
  border-radius: 46% 54% 52% 48% / 47% 53% 46% 54%;
}

.language-switcher--switching .language-switcher__active-indicator {
  border-radius: 70% 30% 62% 38% / 50% 50% 50% 50%;
  animation: language-indicator-switch 700ms cubic-bezier(.65, 0, .35, 1) both;
}

@keyframes language-indicator-switch {
  0% {
    scale: 1 1;
  }

  45% {
    scale: 0.94 0.16;
  }

  100% {
    scale: 1 1;
  }
}

@media (max-width: 640px) {
  .language-switcher {
    top: 1rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .language-switcher__active-indicator {
    transition: none;
    animation: none;
  }

  .language-switcher--switching .language-switcher__active-indicator {
    scale: 1;
  }
}
</style>
