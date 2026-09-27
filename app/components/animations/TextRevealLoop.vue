<script setup lang="ts">
import TextReveal from './TextReveal.vue'

const props = withDefaults(
    defineProps<{
      texts: string[]
      delay?: number
      initialDelay?: number
      revealDuration?: number
      settling?: boolean
      settleDelay?: number
      holdDuration?: number
      disappearDuration?: number
    }>(),
    {
      delay: 55,
      initialDelay: 0,
      revealDuration: 650,
      settling: false,
      settleDelay: 35,
      holdDuration: 1000,
      disappearDuration: 500,
    },
)

const currentIndex = ref(0)
const cycle = ref(0)
const currentText = computed(() => props.texts[currentIndex.value] ?? '')
const currentInitialDelay = computed(() => (cycle.value === 0 ? props.initialDelay : 0))
const revealEnd = computed(() => {
  const staggerSteps = Math.max(Array.from(currentText.value).length - 1, 0)

  return currentInitialDelay.value + staggerSteps * props.delay + props.revealDuration
})
const disappearAfter = computed(() => revealEnd.value + props.holdDuration)

let loopTimer: ReturnType<typeof setTimeout> | undefined

function scheduleNextText() {
  if (loopTimer) {
    clearTimeout(loopTimer)
  }

  if (props.texts.length === 0) {
    return
  }

  loopTimer = setTimeout(() => {
    currentIndex.value = (currentIndex.value + 1) % props.texts.length
    cycle.value += 1
    scheduleNextText()
  }, disappearAfter.value + props.disappearDuration)
}

function restartLoop() {
  currentIndex.value = 0
  cycle.value = 0
  scheduleNextText()
}

onMounted(scheduleNextText)

watch(
    () => [props.texts, props.delay, props.initialDelay, props.revealDuration, props.holdDuration, props.disappearDuration],
    restartLoop,
)

onBeforeUnmount(() => {
  if (loopTimer) {
    clearTimeout(loopTimer)
  }
})
</script>

<template>
  <span class="text-reveal-loop">
    <span
        v-for="(text, index) in texts"
        :key="`${text}-${index}`"
        class="text-reveal-loop__measure"
        aria-hidden="true"
    >
      {{ text }}
    </span>

    <span v-if="currentText" class="text-reveal-loop__current">
      <TextReveal
          :key="`${cycle}-${currentIndex}`"
          :text="currentText"
          :delay="delay"
          :initial-delay="currentInitialDelay"
          :reveal-duration="revealDuration"
          :settling="settling"
          :settle-delay="settleDelay"
          :disappear="true"
          :disappear-after="disappearAfter"
          :disappear-duration="disappearDuration"
      />
    </span>
  </span>
</template>

<style scoped>
.text-reveal-loop {
  display: inline-grid;
  vertical-align: baseline;
}

.text-reveal-loop__measure,
.text-reveal-loop__current {
  grid-area: 1 / 1;
}

.text-reveal-loop__measure {
  visibility: hidden;
  white-space: pre;
}
</style>
