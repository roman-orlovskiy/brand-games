<template>
  <svg ref="svgRef" :width="svgWidth" :viewBox="`0 0 ${svgWidth} ${svgHeight}`" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path ref="pathRef" :d="pathData" :stroke="trajectoryColor" stroke-width="2" stroke-dasharray="8 8"/>
  </svg>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useSettingsStore } from '~/stores/settings'

const settingsStore = useSettingsStore()

interface Props {
  power?: number // 0-1, сила натяжения
}

const props = withDefaults(defineProps<Props>(), {
  power: 0
})

const trajectoryColor = computed(() => {
  return settingsStore.gameSettingsColorsById.trajectory?.color || '#FF335F'
})

const svgRef = ref<SVGSVGElement>()
const pathRef = ref<SVGPathElement>()

// Размеры SVG зависят от силы натяжения
const svgWidth = computed(() => {
  // При слабом натяжении - короткая траектория (195px), при сильном - длинная (780px)
  // Увеличено на 95% (1.5 * 1.3)
  return Math.round((100 + props.power * 300) * 1.95)
})

const svgHeight = computed(() => {
  return 180
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
  // При слабом натяжении - крутая парабола
  // При сильном натяжении - пологая парабола (ближе к прямой)
  
  const curvature = 0.7 - (props.power * 0.5) // От 0.7 (крутая) до 0.2 (пологая)
  
  // Первая контрольная точка - определяет начальный угол вылета
  const cp1X = startX + (width * 0.3)
  const cp1Y = startY - (height * curvature * 0.5)
  
  // Вторая контрольная точка - определяет форму падения
  const cp2X = startX + (width * 0.7)
  const cp2Y = startY - (height * curvature * 0.3)
  
  return `M${startX} ${startY} C${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`
})

// Экспортируем данные для использования в родительском компоненте
defineExpose({
  get pathData() { return pathData.value },
  get svgWidth() { return svgWidth.value },
  get svgHeight() { return svgHeight.value }
})
</script>