<script setup lang="ts">
import rough from 'roughjs'
import type { Options } from 'roughjs/bin/core'
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    stroke?: string
    fill?: string
    seed?: number
    roughness?: number
  }>(),
  {
    stroke: '#22d3ee',
    fill: 'transparent',
    seed: 1,
    roughness: 1.4,
  },
)

const container = ref<HTMLElement>()
const canvas = ref<SVGSVGElement>()
let observer: ResizeObserver | undefined
let animationFrame: number | undefined

function draw() {
  if (!container.value || !canvas.value) return

  const { width, height } = container.value.getBoundingClientRect()
  const inset = 5
  const options: Options = {
    seed: props.seed,
    stroke: props.stroke,
    strokeWidth: 2,
    roughness: props.roughness,
    bowing: 1.2,
  }

  if (props.fill !== 'transparent') {
    options.fill = props.fill
    options.fillStyle = 'hachure'
    options.fillWeight = 0.7
    options.hachureGap = 8
  }

  canvas.value.replaceChildren(
    rough.svg(canvas.value).rectangle(
      inset,
      inset,
      Math.max(0, width - inset * 2),
      Math.max(0, height - inset * 2),
      options,
    ),
  )
}

function scheduleDraw() {
  if (animationFrame !== undefined) cancelAnimationFrame(animationFrame)
  animationFrame = requestAnimationFrame(draw)
}

onMounted(async () => {
  await nextTick()
  draw()
  observer = new ResizeObserver(scheduleDraw)
  if (container.value) observer.observe(container.value)
})

watch(
  () => [props.stroke, props.fill, props.seed, props.roughness],
  scheduleDraw,
)

onBeforeUnmount(() => {
  observer?.disconnect()
  if (animationFrame !== undefined) cancelAnimationFrame(animationFrame)
})
</script>

<template>
  <div ref="container" class="relative">
    <svg
      ref="canvas"
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
    />
    <div class="relative z-10 h-full">
      <slot />
    </div>
  </div>
</template>
