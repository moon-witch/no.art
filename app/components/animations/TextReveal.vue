<script setup lang="ts">
const props = withDefaults(
    defineProps<{
      text: string
      delay?: number
      initialDelay?: number
      revealDuration?: number
      settling?: boolean
      settleDelay?: number
      disappear?: boolean
      disappearAfter?: number
      disappearDuration?: number
    }>(),
    {
      delay: 55,
      initialDelay: 0,
      revealDuration: 650,
      settling: false,
      settleDelay: 35,
      disappear: false,
      disappearAfter: 2000,
      disappearDuration: 500,
    },
)

const letters = computed(() => Array.from(props.text))
const isDisappearing = ref(false)

let disappearTimer: ReturnType<typeof setTimeout> | undefined

function scheduleDisappear() {
  if (disappearTimer) {
    clearTimeout(disappearTimer)
  }

  isDisappearing.value = false

  if (!props.disappear) {
    return
  }

  disappearTimer = setTimeout(() => {
    isDisappearing.value = true
  }, props.disappearAfter)
}

onMounted(scheduleDisappear)

watch(
    () => [props.text, props.disappear, props.disappearAfter],
    scheduleDisappear,
)

onBeforeUnmount(() => {
  if (disappearTimer) {
    clearTimeout(disappearTimer)
  }
})
</script>

<template>
  <span
      class="text-reveal"
      :class="{
        'text-reveal--disappearing': isDisappearing,
        'text-reveal--settling': settling,
      }"
      :style="{
        '--disappear-duration': `${disappearDuration}ms`,
        '--settle-delay': `${settleDelay}ms`,
      }"
      :aria-label="text"
  >
    <span
        v-for="(letter, index) in letters"
        :key="`${letter}-${index}`"
        class="text-reveal__letter"
        :style="{
          '--i': index,
          '--delay': `${delay}ms`,
          '--initial-delay': `${initialDelay}ms`,
          '--reveal-duration': `${revealDuration}ms`,
        }"
        aria-hidden="true"
    >
      <span class="text-reveal__glyph">
        {{ letter === ' ' ? '\u00A0' : letter }}
      </span>
    </span>
  </span>
</template>

<style scoped>
.text-reveal {
  display: inline-flex;
  overflow: visible;
  transform-origin: center bottom;
  will-change: opacity, filter, transform;
}

.text-reveal__letter {
  display: inline-block;
  opacity: 0;
  filter: blur(10px);
  transform: translateY(0.4em);
  animation: text-reveal-letter var(--reveal-duration) cubic-bezier(.16, 1, .3, 1) forwards;
  animation-delay: calc(var(--initial-delay) + var(--i) * var(--delay));
}

.text-reveal__glyph {
  display: inline-block;
  will-change: filter, transform;
}

.text-reveal--settling .text-reveal__glyph {
  animation: text-reveal-settle 900ms cubic-bezier(.65, 0, .35, 1) both;
  animation-delay: calc(var(--i) * var(--settle-delay));
}

.text-reveal__letter:nth-child(odd) .text-reveal__glyph {
  --settle-tilt: -1.2deg;
}

.text-reveal__letter:nth-child(even) .text-reveal__glyph {
  --settle-tilt: 1.2deg;
}

.text-reveal--disappearing {
  animation: text-reveal-exit var(--disappear-duration) cubic-bezier(.4, 0, .8, 1) forwards;
}

@keyframes text-reveal-letter {
  to {
    opacity: 1;
    filter: blur(0);
    transform: translateY(0);
  }
}

@keyframes text-reveal-exit {
  35% {
    filter: blur(1px);
    transform: translateY(0.12em) skewY(1deg) scaleY(0.98);
  }

  to {
    opacity: 0;
    filter: blur(8px);
    transform: translateY(0.75em) skewY(3deg) scaleX(1.03) scaleY(0.88);
  }
}

@keyframes text-reveal-settle {
  30% {
    filter: blur(0.4px);
    transform: translateY(-0.22em) rotate(var(--settle-tilt)) scale(1.035);
  }

  72% {
    filter: blur(0);
    transform: translateY(0.1em) rotate(0.5deg) scaleX(0.98) scaleY(1.02);
  }

  to {
    filter: blur(0);
    transform: translateY(0) rotate(0) scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .text-reveal__letter,
  .text-reveal--disappearing .text-reveal__letter,
  .text-reveal--disappearing,
  .text-reveal--settling .text-reveal__glyph {
    animation: none;
    opacity: 1;
    filter: none;
    transform: none;
  }
}
</style>
