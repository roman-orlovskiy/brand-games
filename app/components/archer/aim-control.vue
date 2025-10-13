<template>
  <div class="aim-control">
    <!-- Внешний круг -->
    <div class="aim-control__outer-circle">
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
import { ref, computed, onUnmounted } from 'vue'
import { useSettingsStore } from '~/stores/settings'

const settingsStore = useSettingsStore()

const emit = defineEmits<{
  aimChange: [position: { x: number, y: number, power: number }]
  shoot: [position: { x: number, y: number, power: number }]
}>()

const outerRadius = 48 // Радиус внешнего круга
const innerRadius = 16 // Радиус внутреннего круга
const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })
const currentPosition = ref({ x: 0, y: 0 })

const innerCircleStyle = computed(() => {
  const x = currentPosition.value.x
  const y = currentPosition.value.y
  const interfaceColor = settingsStore.gameSettingsColorsById.interface?.color || '#00BCD4'
  return {
    transform: `translate(${x}px, ${y}px)`,
    transition: isDragging.value ? 'none' : 'transform 0.2s ease-out',
    background: interfaceColor
  }
})

const startDrag = (e: MouseEvent | TouchEvent) => {
  isDragging.value = true
  
  const outerCircle = (e.target as HTMLElement).closest('.aim-control__outer-circle')
  if (!outerCircle) return
  
  const rect = outerCircle.getBoundingClientRect()
  
  const clientX = 'touches' in e ? e.touches[0]?.clientX : e.clientX
  const clientY = 'touches' in e ? e.touches[0]?.clientY : e.clientY
  
  if (clientX === undefined || clientY === undefined) return
  
  dragStart.value = {
    x: clientX - rect.left - rect.width / 2,
    y: clientY - rect.top - rect.height / 2
  }
  
  currentPosition.value = { ...dragStart.value }
  emitAimChange()
  
  document.addEventListener('mousemove', handleDrag)
  document.addEventListener('mouseup', endDrag)
  document.addEventListener('touchmove', handleDrag)
  document.addEventListener('touchend', endDrag)
}

const handleDrag = (e: MouseEvent | TouchEvent) => {
  if (!isDragging.value) return
  
  const outerCircle = document.querySelector('.aim-control__outer-circle')
  if (!outerCircle) return
  
  const rect = outerCircle.getBoundingClientRect()
  
  const clientX = 'touches' in e ? e.touches[0]?.clientX : e.clientX
  const clientY = 'touches' in e ? e.touches[0]?.clientY : e.clientY
  
  if (clientX === undefined || clientY === undefined) return
  
  const x = clientX - rect.left - rect.width / 2
  const y = clientY - rect.top - rect.height / 2
  
  // Ограничиваем движение внутри внешнего круга
  const distance = Math.sqrt(x * x + y * y)
  const maxDistance = outerRadius - innerRadius
  
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
  const normalizedX = x / (outerRadius - innerRadius)
  const normalizedY = y / (outerRadius - innerRadius)
  const power = Math.sqrt(normalizedX * normalizedX + normalizedY * normalizedY)
  
  if (power > 0.1) {
    emit('shoot', {
      x: normalizedX,
      y: normalizedY,
      power: Math.min(power, 1)
    })
  }
  
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
  const normalizedX = x / (outerRadius - innerRadius)
  const normalizedY = y / (outerRadius - innerRadius)
  
  // Сила натяжения зависит от расстояния от центра
  const power = Math.sqrt(normalizedX * normalizedX + normalizedY * normalizedY)

  emit('aimChange', {
    x: normalizedX,
    y: normalizedY,
    power: Math.min(power, 1)
  })
}

onUnmounted(() => {
  document.removeEventListener('mousemove', handleDrag)
  document.removeEventListener('mouseup', endDrag)
  document.removeEventListener('touchmove', handleDrag)
  document.removeEventListener('touchend', endDrag)
})
</script>

<style scoped lang="scss">
.aim-control {
  position: absolute;
  top: 30%;
  left: 20px;
  transform: translateY(-50%);
  z-index: 200;

  &__outer-circle {
    width: 96px;
    height: 96px;
    border: 3px solid #333;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    position: relative;
    cursor: pointer;
    user-select: none;
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
