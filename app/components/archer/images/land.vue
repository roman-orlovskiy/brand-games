<template>
  <svg width="100%" viewBox="0 0 1453 318" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M387 168C139.8 190.4 20.3333 204 -8.5 208L-43.5 357.5L1499 371.5V70.0001C1239.5 68.0001 696 140 387 168Z" :fill="landColor"/>
  <path d="M927 51.4026C859.5 44.4026 845 130.903 845 138.403H856.5C870.5 68.8026 909.333 51.4026 927 51.4026Z" :fill="landColor"/>
  <path d="M803.5 138.403C803.5 78.8026 784.167 55.5693 774.5 51.4026C802.5 51.4026 817.167 109.403 821 138.403H803.5Z" :fill="landColor"/>
  <path d="M916.5 84.4026C874.1 88.4026 867.167 116.403 869 129.903H876C870.8 100.703 900.833 87.4026 916.5 84.4026Z" :fill="landColor"/>
  <path d="M786 138.403C776.8 111.203 742.167 104.069 726 103.903C775.2 119.503 778.833 133.403 774.5 138.403H786Z" :fill="landColor"/>
  <path d="M1523 0.4026C1455.5 -6.5974 1441 79.9026 1441 87.4026H1452.5C1466.5 17.8026 1505.33 0.402606 1523 0.4026Z" :fill="landColor"/>
  <path d="M1399.5 87.4026C1399.5 27.8026 1380.17 4.56927 1370.5 0.4026C1398.5 0.4026 1413.17 58.4026 1417 87.4026H1399.5Z" :fill="landColor"/>
  <path d="M1512.5 33.4026C1470.1 37.4026 1463.17 65.4026 1465 78.9026H1472C1466.8 49.7026 1496.83 36.4026 1512.5 33.4026Z" :fill="landColor"/>
  <path d="M1382 87.4026C1372.8 60.2026 1338.17 53.0693 1322 52.9026C1371.2 68.5026 1374.83 82.4026 1370.5 87.4026H1382Z" :fill="landColor"/>
  <path d="M342.998 123.5C314.598 132.7 310.165 163.667 311.498 178H319.5C316.7 147.2 333.999 128.833 342.998 123.5Z" :fill="landColorLight"/>
  <path d="M372 123.5C336 123.5 329 159.833 330 178H342.998C334.196 150.4 358.665 130.167 372 123.5Z" :fill="landColorLight"/>
  <path d="M296.5 178C304.1 156 296.333 135.5 291.5 128C308.3 139.2 309.167 166 307.5 178H296.5Z" :fill="landColorLight"/>
  <path d="M386.5 150.5C361.3 150.5 355 169.833 355 179.5L606 169.5C597.667 163.167 577.3 148.5 562.5 140.5C547.7 132.5 517 143.833 503.5 150.5C503.5 138.1 483.5 138.667 473.5 140.5C463.9 132.5 447.5 137.167 440.5 140.5C447.5 134.167 457.3 119.3 440.5 110.5C423.7 101.7 416.833 122.167 415.5 133.5C395.5 127.9 387.833 142.5 386.5 150.5Z" :fill="landColor"/>
  <path d="M640 119C618 119 614.833 140 616 150.5L747.5 140.5C747.5 138.167 745.3 130.6 736.5 119C727.7 107.4 715.833 114.167 711 119C711 112.167 705.5 97.3001 683.5 92.5001C661.5 87.7001 657.333 102.5 658 110.5C646.4 103.7 641.167 113.334 640 119Z" :fill="landColor"/>
  </svg>
</template>

<script setup lang="ts">
import { useSettingsStore } from '~/stores/settings'
import { storeToRefs } from 'pinia'

const settingsStore = useSettingsStore()
const { gameSettings } = storeToRefs(settingsStore)

const landColor = computed(() => {
  const landColorSetting = gameSettings.value?.colors?.find(color => color.id === 'land')
  return landColorSetting?.color || '#00BFA5'
})

// Функция для осветления цвета (для создания вариации)
const lightenColor = (color: string, percent: number) => {
  // Удаляем # если есть
  const hex = color.replace('#', '')
  
  // Конвертируем в RGB
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  
  // Осветляем на указанный процент
  const lightenedR = Math.min(255, Math.floor(r + (255 - r) * (percent / 100)))
  const lightenedG = Math.min(255, Math.floor(g + (255 - g) * (percent / 100)))
  const lightenedB = Math.min(255, Math.floor(b + (255 - b) * (percent / 100)))
  
  // Конвертируем обратно в HEX
  const toHex = (n: number) => n.toString(16).padStart(2, '0')
  return `#${toHex(lightenedR)}${toHex(lightenedG)}${toHex(lightenedB)}`
}

const landColorLight = computed(() => {
  return lightenColor(landColor.value, 15) // Осветляем на 15%
})
</script>