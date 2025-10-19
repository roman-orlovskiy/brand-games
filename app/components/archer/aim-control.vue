<template>
  <div class="aim-control" :style="aimControlStyle">
    <!-- Внешний круг -->
    <div class="aim-control__outer-circle" :style="outerCircleStyle">
      <!-- Внутренний круг (джойстик) -->
      <div 
        class="aim-control__inner-circle"
        :style="innerCircleStyle"
        @mousedown="startDrag"
        @touchstart="startDrag"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted, inject } from 'vue'
import { useSettingsStore } from '~/stores/settings'

const settingsStore = useSettingsStore()

const emit = defineEmits<{
  aimChange: [position: { x: number, y: number, power: number }]
  shoot: [position: { x: number, y: number, power: number }]
}>()

// Получаем scale из родительского компонента (800px = scale 1)
const gameScale = inject<{ value: number }>('gameScale', { value: 1 })

// Базовые радиусы для масштаба 1 (800px)
const baseOuterRadius = 48
const baseInnerRadius = 16

// Радиусы с учетом scale
const outerRadius = computed(() => baseOuterRadius * gameScale.value)
const innerRadius = computed(() => baseInnerRadius * gameScale.value)

const isDragging = ref(false)
const dragStartPoint = ref({ x: 0, y: 0 }) // Точка, где начали тащить
const currentPosition = ref({ x: 0, y: 0 })

const interfaceColor = computed(() => {
  return settingsStore.gameSettingsColorsById.interface?.color || '#00BCD4'
})

const aimControlStyle = computed(() => {
  // Масштабируем отступ слева (базовый 20px)
  const baseLeft = 20
  return {
    left: `${baseLeft * gameScale.value}px`
  }
})

const outerCircleStyle = computed(() => {
  return {
    borderColor: interfaceColor.value,
    transform: `scale(${gameScale.value})`
  }
})

const innerCircleStyle = computed(() => {
  const x = currentPosition.value.x
  const y = currentPosition.value.y
  return {
    transform: `translate(${x}px, ${y}px)`,
    transition: isDragging.value ? 'none' : 'transform 0.2s ease-out',
    background: interfaceColor.value
  }
})

// Метод для начала драга из любой точки экрана (вызывается из archer-game)
const startDragFromAnywhere = (e: MouseEvent | TouchEvent) => {
  e.preventDefault()
  e.stopPropagation()
  
  isDragging.value = true
  
  const clientX = 'touches' in e ? e.touches[0]?.clientX : e.clientX
  const clientY = 'touches' in e ? e.touches[0]?.clientY : e.clientY
  
  if (clientX === undefined || clientY === undefined) return
  
  // Запоминаем начальную точку клика как виртуальный центр джойстика
  dragStartPoint.value = {
    x: clientX,
    y: clientY
  }
  
  // Начинаем с нулевой позиции
  currentPosition.value = { x: 0, y: 0 }
  emitAimChange()
  
  document.addEventListener('mousemove', handleDrag)
  document.addEventListener('mouseup', endDrag)
  document.addEventListener('touchmove', handleDrag)
  document.addEventListener('touchend', endDrag)
}

// Метод для начала драга с самого джойстика (оставляем для совместимости)
const startDrag = (e: MouseEvent | TouchEvent) => {
  e.preventDefault()
  e.stopPropagation()
  startDragFromAnywhere(e)
}

const handleDrag = (e: MouseEvent | TouchEvent) => {
  if (!isDragging.value) return
  
  const clientX = 'touches' in e ? e.touches[0]?.clientX : e.clientX
  const clientY = 'touches' in e ? e.touches[0]?.clientY : e.clientY
  
  if (clientX === undefined || clientY === undefined) return
  
  // Вычисляем смещение от начальной точки клика
  const x = clientX - dragStartPoint.value.x
  const y = clientY - dragStartPoint.value.y
  
  // Ограничиваем движение внутри виртуального круга
  const distance = Math.sqrt(x * x + y * y)
  const maxDistance = outerRadius.value - innerRadius.value
  
  if (distance <= maxDistance) {
    currentPosition.value = { x, y }
  } else {
    // Если выходим за границы, ограничиваем по окружности
    const angle = Math.atan2(y, x)
    currentPosition.value = {
      x: Math.cos(angle) * maxDistance,
      y: Math.sin(angle) * maxDistance
    }
  }
  
  emitAimChange()
}

const endDrag = () => {
  isDragging.value = false
  
  // Если была сила натяжения, выстреливаем
  const x = currentPosition.value.x
  const y = currentPosition.value.y
  const normalizedX = x / (outerRadius.value - innerRadius.value)
  const normalizedY = y / (outerRadius.value - innerRadius.value)
  // Сила натяжения: справа = 0, центр = 0.5, слева = 1
  const power = (1 - normalizedX) / 2
  
  emit('shoot', {
    x: normalizedX,
    y: normalizedY,
    power: Math.max(0, Math.min(power, 1))
  })
  
  // Возвращаем джойстик в центр
  currentPosition.value = { x: 0, y: 0 }
  emitAimChange()
  
  document.removeEventListener('mousemove', handleDrag)
  document.removeEventListener('mouseup', endDrag)
  document.removeEventListener('touchmove', handleDrag)
  document.removeEventListener('touchend', endDrag)
}

const emitAimChange = () => {
  const x = currentPosition.value.x
  const y = currentPosition.value.y
  
  // Нормализуем значения от -1 до 1
  const normalizedX = x / (outerRadius.value - innerRadius.value)
  const normalizedY = y / (outerRadius.value - innerRadius.value)
  
  // Сила натяжения:
  // - В правой точке (x = 1) → power = 0
  // - В центре (x = 0) → power = 0.5
  // - В левой точке (x = -1) → power = 1
  const power = (1 - normalizedX) / 2

  emit('aimChange', {
    x: normalizedX,
    y: normalizedY,
    power: Math.max(0, Math.min(power, 1))
  })
}

onUnmounted(() => {
  document.removeEventListener('mousemove', handleDrag)
  document.removeEventListener('mouseup', endDrag)
  document.removeEventListener('touchmove', handleDrag)
  document.removeEventListener('touchend', endDrag)
})

// Экспонируем метод для использования из родительского компонента
defineExpose({
  startDragFromAnywhere
})
</script>

<style scoped lang="scss">
.aim-control {
  position: absolute;
  top: 40%;
  left: 20px;
  transform: translateY(-50%);
  z-index: 200;

  &__outer-circle {
    width: 96px;
    height: 96px;
    border: 3px solid;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    position: relative;
    cursor: pointer;
    user-select: none;
    transform-origin: center center;
  }

  &__inner-circle {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -16px;
    margin-top: -16px;
    cursor: grab;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    
    &:active {
      cursor: grabbing;
    }
  }
}
</style>
