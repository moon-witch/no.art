<script setup lang="ts">
withDefaults(defineProps<{
  lineOpacity?: string
}>(), {
  lineOpacity: '10%',
})

const ringCount = 4
const circles: Array<[number, number]> = []

for (let q = -ringCount; q <= ringCount; q += 1) {
  for (let r = -ringCount; r <= ringCount; r += 1) {
    const distance = Math.max(Math.abs(q), Math.abs(r), Math.abs(q + r))

    if (distance > 0 && distance <= ringCount) {
      circles.push([
        (q + r / 2) / 2,
        r * Math.sqrt(3) / 4,
      ])
    }
  }
}
</script>

<template>
  <div
      class="flower-of-life"
      :style="{ '--flower-line-opacity': lineOpacity }"
      aria-hidden="true"
  >
    <div class="flower-of-life__geometry">
      <span
          v-for="([x, y], index) in circles"
          :key="index"
          class="flower-of-life__circle"
          :style="{ transform: `translate(${x * 100}%, ${y * 100}%)` }"
      />
    </div>
  </div>
</template>

<style scoped>
.flower-of-life {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

.flower-of-life__geometry {
  position: absolute;
  top: 50%;
  left: 50%;
  width: var(--center-circle-size);
  aspect-ratio: 1;
  transform: translate(-50%, -50%);
}

.flower-of-life__circle {
  position: absolute;
  inset: 0;
  border-radius: 50%;
}

.flower-of-life__circle {
  box-sizing: border-box;
  border: 1px solid rgb(229 221 255 / var(--flower-line-opacity));
  box-shadow: 0 0 1.6rem rgb(160 126 255 / 4%);
}

</style>
