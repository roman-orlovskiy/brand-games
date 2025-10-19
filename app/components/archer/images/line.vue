<template>
  <svg id="line" ref="svgRef" viewBox="0 0 1200 700" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="trajectoryGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" :stop-color="trajectoryColor" stop-opacity="1"/>
        <stop offset="16%" :stop-color="trajectoryColor" stop-opacity="1"/>
        <stop offset="16%" :stop-color="trajectoryColor" stop-opacity="0"/>
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

// Функция для генерации динамической траектории
const generateTrajectory = (x: number, y: number) => {
  // Нормализуем значения: x и y от -1 до 1, power от 0 до 1
  const normalizedY = Math.max(-1, Math.min(1, y))
  
  // Базовые параметры
  const startX = 0
  const startY = 700
  const baseEndX = 1000
  const baseEndY = 700
  
  // Высота параболы зависит от направления Y (чем выше лук, тем ниже траектория)
  // Y = -1 (максимально вверх) -> низкая траектория
  // Y = 1 (максимально вниз) -> высокая траектория
  const heightMultiplier = 0.5 + (1 + normalizedY) * 2 // От 0.5 до 1
  const baseHeight = 300
  const peakHeight = baseHeight * heightMultiplier
  
  // Дальность полета зависит от силы натяжения и направления X
  // При горизонтальном луке (Y близко к 0) дальность больше зависит от X
  // При вертикальном луке (Y близко к -1) дальность больше зависит от power
  const horizontalFactor = -x*800
  const endX = baseEndX + horizontalFactor
  
  // Центральная точка (вершина параболы) всегда симметрична
  const centerX = endX / 2
  const centerY = startY - peakHeight
  
  return `M ${startX},${startY} Q ${centerX},${centerY} ${endX},${baseEndY}`
}

// Генерация кривой Безье для параболы
const pathData = computed(() => {
  const aimPos = props.aimPosition || { x: 0, y: 0, power: 0 }
  return generateTrajectory(aimPos.x, aimPos.y)
})

// Экспортируем данные для использования в родительском компоненте
defineExpose({
  get pathData() { return pathData.value },
})
</script>