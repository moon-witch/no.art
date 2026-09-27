<script setup lang="ts">
import countriesTopology from 'world-atlas/countries-110m.json'
import isoCountries from 'i18n-iso-countries'
import { feature } from 'topojson-client'
import * as THREE from 'three'
import ThreeGlobe from 'three-globe'

type Country = { code: string, note: Record<string, string> }
type Marker = { id: string, countryCode: string, latitude: number, longitude: number, label: string | null, note: Record<string, string> }

const props = defineProps<{ countries: Country[], markers: Marker[], active?: boolean }>()
const emit = defineEmits<{ selectCountry: [code: string], selectMarker: [id: string], reset: [] }>()

const mount = ref<HTMLDivElement>()
const hasWebGl = ref(true)
const isSelected = ref(false)
const isPointerHeld = ref(false)
const isManuallyPositioned = ref(false)
let dispose: (() => void) | undefined

watch(() => props.active, active => {
  if (!active) isSelected.value = false
})

const numericCode = (code: string) => isoCountries.alpha3ToNumeric(code.toUpperCase())?.padStart(3, '0')

onMounted(async () => {
  if (!mount.value) return

  try {
    const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls.js')
    const width = mount.value.clientWidth
    const height = mount.value.clientHeight
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
    renderer.setSize(width, height)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    mount.value.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 1000)
    camera.position.set(0, 0, 520)
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.enablePan = false
    controls.minDistance = 320
    controls.maxDistance = 620
    controls.autoRotate = false

    scene.add(new THREE.AmbientLight(0x9f86df, 1.7))
    const keyLight = new THREE.DirectionalLight(0xaed8ff, 2.4)
    keyLight.position.set(180, 130, 260)
    scene.add(keyLight)

    const globeGroup = new THREE.Group()
    globeGroup.scale.setScalar(1.2)
    scene.add(globeGroup)
    const base = new THREE.Mesh(
      new THREE.SphereGeometry(100, 64, 64),
      new THREE.MeshPhongMaterial({ color: 0x10162d, transparent: true, opacity: 0.74, shininess: 85 }),
    )
    globeGroup.add(base)
    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(103, 64, 64),
      new THREE.MeshBasicMaterial({ color: 0x758cff, transparent: true, opacity: 0.075, side: THREE.BackSide }),
    )
    globeGroup.add(atmosphere)

    const visitedCodes = new Set(props.countries.map(country => numericCode(country.code)).filter(Boolean))
    const topology = countriesTopology as any
    const countryFeatures = (feature(topology, topology.objects.countries) as any).features.map((item: any) => ({
      ...item,
      numericCode: String(item.id).padStart(3, '0'),
    }))
    const globe = new ThreeGlobe({ animateIn: false })
      .showGlobe(false)
      .showAtmosphere(false)
      .polygonsData(countryFeatures)
      .polygonCapColor((item: any) => visitedCodes.has(item.numericCode) ? 'rgba(112, 207, 255, 0.42)' : 'rgba(0, 0, 0, 0)')
      .polygonSideColor(() => 'rgba(94, 160, 255, 0.12)')
      .polygonStrokeColor((item: any) => visitedCodes.has(item.numericCode) ? 'rgba(203, 247, 255, 0.98)' : 'rgba(129, 158, 235, 0.48)')
      .polygonAltitude((item: any) => visitedCodes.has(item.numericCode) ? 0.018 : 0.004)
      .polygonsTransitionDuration(650)
      .pointsData(props.markers)
      .pointLat('latitude')
      .pointLng('longitude')
      .pointColor(() => '#dff8ff')
      .pointAltitude(0.035)
      .pointRadius(0.28)
      .pointResolution(10)
    globeGroup.add(globe)

    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2()
    let didDrag = false
    const selectAtPointer = (event: PointerEvent) => {
      if (didDrag) return

      const bounds = renderer.domElement.getBoundingClientRect()
      pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1
      pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1
      raycaster.setFromCamera(pointer, camera)
      const hit = raycaster.intersectObjects(globe.children, true)[0]
      let target: THREE.Object3D | null = hit?.object ?? null
      while (target && !(target as any).__data) target = target.parent
      const data = target && (target as any).__data

      if (!data) {
        isSelected.value = false
        isManuallyPositioned.value = false
        emit('reset')
        return
      }

      if ('latitude' in data) {
        isManuallyPositioned.value = false
        isSelected.value = true
        emit('selectMarker', data.id)
        return
      }

      if (data.numericCode && visitedCodes.has(data.numericCode)) {
        const match = props.countries.find(country => numericCode(country.code) === data.numericCode)
        if (match) {
          isManuallyPositioned.value = false
          isSelected.value = true
          emit('selectCountry', match.code)
        }
      }
      else {
        isSelected.value = false
        isManuallyPositioned.value = false
        emit('reset')
      }
    }
    renderer.domElement.addEventListener('pointerup', selectAtPointer)
    let pointerStart: { x: number, y: number } | undefined
    const stopRotation = (event: PointerEvent) => {
      isPointerHeld.value = true
      pointerStart = { x: event.clientX, y: event.clientY }
      didDrag = false
    }
    const trackManualRotation = (event: PointerEvent) => {
      if (!pointerStart) return
      if (Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y) > 5) {
        didDrag = true
        isManuallyPositioned.value = true
      }
    }
    const resumeRotation = () => {
      isPointerHeld.value = false
      pointerStart = undefined
    }
    renderer.domElement.addEventListener('pointerdown', stopRotation)
    renderer.domElement.addEventListener('pointermove', trackManualRotation)
    renderer.domElement.addEventListener('pointerup', resumeRotation)
    renderer.domElement.addEventListener('pointercancel', resumeRotation)

    let frame = 0
    const animate = () => {
      frame = requestAnimationFrame(animate)
      if (!isSelected.value && !isPointerHeld.value && !isManuallyPositioned.value) globeGroup.rotation.y += 0.0012
      if (!isPointerHeld.value && !isManuallyPositioned.value) {
        const targetDistance = isSelected.value ? 400 : 520
        camera.position.lerp(new THREE.Vector3(0, 0, targetDistance), 0.025)
      }
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    const resize = () => {
      if (!mount.value) return
      const nextWidth = mount.value.clientWidth
      const nextHeight = mount.value.clientHeight
      camera.aspect = nextWidth / nextHeight
      camera.updateProjectionMatrix()
      renderer.setSize(nextWidth, nextHeight)
    }
    window.addEventListener('resize', resize)
    dispose = () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      renderer.domElement.removeEventListener('pointerup', selectAtPointer)
      renderer.domElement.removeEventListener('pointerdown', stopRotation)
      renderer.domElement.removeEventListener('pointermove', trackManualRotation)
      renderer.domElement.removeEventListener('pointerup', resumeRotation)
      renderer.domElement.removeEventListener('pointercancel', resumeRotation)
      renderer.dispose()
      globeGroup.traverse(object => {
        const mesh = object as THREE.Mesh
        mesh.geometry?.dispose?.()
        const material = mesh.material as THREE.Material | THREE.Material[] | undefined
        if (Array.isArray(material)) material.forEach(item => item.dispose())
        else material?.dispose?.()
      })
      renderer.domElement.remove()
    }
  }
  catch {
    hasWebGl.value = false
  }
})

onBeforeUnmount(() => dispose?.())
</script>

<template>
  <div ref="mount" class="earth-globe" aria-label="Interactive globe">
    <p v-if="!hasWebGl" class="earth-globe__fallback">Your browser cannot display the globe.</p>
  </div>
</template>

<style scoped>
.earth-globe { position: absolute; z-index: 1; inset: 0; display: grid; place-items: center; touch-action: none; }
.earth-globe :deep(canvas) { width: 100%; height: 100%; outline: none; }
.earth-globe__fallback { padding: 1rem; border: 1px solid rgb(255 255 255 / 30%); border-radius: .75rem; background: rgb(5 4 14 / 72%); }
</style>
