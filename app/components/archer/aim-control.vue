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
      >
        <!-- Центральная точка для визуального центрирования -->
        <div class="aim-control__center-dot" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'

const emit = defineEmits<{
  aimChange: [position: { x: number, y: number, power: number }]
  shoot: [position: { x: number, y: number, power: number }]
}>()

const outerRadius = 60 // Радиус внешнего круга
const innerRadius = 20 // Радиус внутреннего круга
const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })
const currentPosition = ref({ x: 0, y: 0 })

const innerCircleStyle = computed(() => {
  const x = currentPosition.value.x
  const y = currentPosition.value.y
  return {
    transform: `translate(${x}px, ${y}px)`,
    transition: isDragging.value ? 'none' : 'transform 0.2s ease-out'
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
  top: 20px;
  right: 20px;
  z-index: 200;

  &__outer-circle {
    width: 120px;
    height: 120px;
    border: 3px solid #333;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    position: relative;
    cursor: pointer;
    user-select: none;
  }

  &__inner-circle {
    width: 40px;
    height: 40px;
    background: #007bff;
    border: 2px solid #fff;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -20px;
    margin-top: -20px;
    cursor: grab;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    
    &:active {
      cursor: grabbing;
    }
  }

  &__center-dot {
    width: 6px;
    height: 6px;
    background: #fff;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -3px;
    margin-top: -3px;
  }
}
</style>
