<template>
  <svg ref="svgRef" :width="svgWidth" :viewBox="`0 0 ${svgWidth} ${svgHeight}`" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="trajectoryGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" :stop-color="trajectoryColor" stop-opacity="1"/>
        <stop offset="50%" :stop-color="trajectoryColor" stop-opacity="1"/>
        <stop offset="50%" :stop-color="trajectoryColor" stop-opacity="0"/>
        <stop offset="100%" :stop-color="trajectoryColor" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <path ref="pathRef" :d="pathData" stroke="url(#trajectoryGradient)" :stroke-width="strokeWidth" :stroke-dasharray="strokeDasharray"/>
  </svg>
</template>

<script setup lang="ts">
import { computed, ref, inject } from 'vue'
import { useSettingsStore } from '~/stores/settings'

const settingsStore = useSettingsStore()

interface Props {
  power?: number // 0-1, сила натяжения
  aimPosition?: { x: number, y: number, power: number } // Позиция джойстика
}

const props = withDefaults(defineProps<Props>(), {
  power: 0,
  aimPosition: () => ({ x: 0, y: 0, power: 0 })
})

const trajectoryColor = computed(() => {
  return settingsStore.gameSettingsColorsById.trajectory?.color || '#FF335F'
})

const svgRef = ref<SVGSVGElement>()
const pathRef = ref<SVGPathElement>()

// Получаем scale из родительского компонента (800px = scale 1)
const gameScale = inject<{ value: number }>('gameScale', { value: 1 })

// Базовые размеры SVG для масштаба 1 (800px)
const baseWidth = computed(() => {
  // При слабом натяжении - короткая траектория, при сильном - длинная
  return (240 + props.power * 250) * 1.95
})

const baseHeight = 260

// Размеры SVG с учетом scale
const svgWidth = computed(() => {
  return Math.round(baseWidth.value * gameScale.value)
})

const svgHeight = computed(() => {
  return Math.round(baseHeight * gameScale.value)
})

// Толщина линии и пунктир с учетом scale
const strokeWidth = computed(() => {
  return 2 * gameScale.value
})

const strokeDasharray = computed(() => {
  // Базовый размер пунктира увеличен в 2 раза (с 8 до 16)
  // Пунктир уменьшается при увеличении силы натяжения
  const baseDash = 16
  const powerMultiplier = 1 - (props.power * 0.6) // От 1 (слабая сила) до 0.5 (сильная сила)
  const dash = baseDash * gameScale.value * powerMultiplier
  return `${dash} ${dash}`
})

// Генерация кривой Безье для параболы
const pathData = computed(() => {
  const width = svgWidth.value
  const height = svgHeight.value
  
  // Начальная точка (левый край, по центру вертикали) - выходит из стрелы
  const startX = 1
  const startY = height / 2 - 20 // Поднимаем выше, чтобы совпадало с кончиком стрелы
  
  // Конечная точка траектории
  const endX = width - 1
  const endY = height - 10 // Приземление внизу
  
  // Контрольные точки для параболы
  // Изгиб зависит от вертикального положения джойстика
  // Джойстик вниз (y > 0) - сильнее парабола (как тело, брошенное под углом)
  // Джойстик вверх (y < 0) - более пологая траектория
  
  const baseCurvature = 0.9 - (props.power * 0.4) // Базовый изгиб от силы
  const verticalInfluence = (props.aimPosition?.y || 0) * 0.8 // Вертикальное влияние в 10 раз сильнее (0.35 * 10)
  const curvature = Math.max(0.1, baseCurvature + verticalInfluence) // Ограничиваем минимум, чтобы не переворачивалась
  
  // Для симметричной параболы контрольные точки располагаем симметрично
  // относительно вертикали через центр и на одинаковой высоте
  const peakHeight = height * curvature
  
  // Первая контрольная точка - на 1/3 пути по горизонтали
  const cp1X = startX + (width * 0.33)
  const cp1Y = startY - peakHeight
  
  // Вторая контрольная точка - симметрично первой относительно центра
  const cp2X = endX - (width * 0.33)
  const cp2Y = startY - peakHeight
  
  return `M${startX} ${startY} C${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`
})

// Экспортируем данные для использования в родительском компоненте
defineExpose({
  get pathData() { return pathData.value },
  get svgWidth() { return svgWidth.value },
  get svgHeight() { return svgHeight.value }
})
</script>