<template>
  <svg width="100%" viewBox="0 0 152 75" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M6.21037 56.9122L16.2955 61.5654L14.5933 73.1301C14.5933 73.1301 32.8774 62.8202 34.487 60.3701L33.5673 53.1227L27.4168 50.4421C27.4168 50.4421 18.6925 51.8523 6.21037 56.9122Z" fill="white" :stroke="arrowColor" stroke-width="1.03514" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M11.7665 54.8272L22.0377 60.6085L19.4403 70.3737" :stroke="arrowColor" stroke-width="1.03514" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M20.2737 52.1902L27.6902 56.0392L25.8279 66.576" :stroke="arrowColor" stroke-width="1.03514" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M115.672 13.694L18.7975 60.6479L19.7907 62.6972L116.666 15.7433L115.672 13.694Z" :fill="arrowColor" stroke="arrowColor" stroke-width="1.03514" stroke-linecap="round" stroke-linejoin="round"/>
  <path ref="arrowTipRef" d="M107.544 9.74104L113.792 14.8561L115.08 23.933L141.527 0.166723L107.544 9.74104Z" :fill="arrowColor"/>
  </svg>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useSettingsStore } from '~/stores/settings'

const settingsStore = useSettingsStore()

const arrowTipRef = ref<SVGPathElement | null>(null)

const arrowColor = computed(() => {
  return settingsStore.gameSettingsColorsById.arrow?.color || '#C27BA0'
})

// Экспонируем ref для использования в родительском компоненте
defineExpose({
  arrowTipRef
})
</script>