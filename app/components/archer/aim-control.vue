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
import { ref, computed, onUnmounted, onMounted, inject } from 'vue'
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
const isSimulating = ref(false) // Флаг для симуляции
const isUserInteracting = ref(false) // Флаг для отслеживания взаимодействия пользователя
const dragStartPoint = ref({ x: 0, y: 0 }) // Точка, где начали тащить
const currentPosition = ref({ x: 0, y: 0 })

// ID интервала и таймера для симуляции
let simulationInterval: number | null = null
let initialTimeout: number | null = null
let simulationTimeouts: number[] = [] // Массив для хранения ID вложенных таймеров

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
    transition: (isDragging.value && !isSimulating.value) ? 'none' : 'transform 0.2s ease-out',
    background: interfaceColor.value
  }
})

// Метод для начала драга из любой точки экрана (вызывается из archer-game)
const startDragFromAnywhere = (e: MouseEvent | TouchEvent) => {
  e.preventDefault()
  e.stopPropagation()
  
  // Пользователь начал взаимодействие - останавливаем симуляцию
  isUserInteracting.value = true
  isDragging.value = true
  
  // Очищаем интервал и таймер симуляции
  if (simulationInterval) {
    clearInterval(simulationInterval)
    simulationInterval = null
  }
  if (initialTimeout) {
    clearTimeout(initialTimeout)
    initialTimeout = null
  }
  // Очищаем все вложенные таймеры симуляции
  simulationTimeouts.forEach(timeoutId => {
    clearTimeout(timeoutId)
  })
  simulationTimeouts = []
  
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
  
  // Пользователь начал взаимодействие - останавливаем симуляцию
  isUserInteracting.value = true
  
  // Очищаем интервал и таймер симуляции
  if (simulationInterval) {
    clearInterval(simulationInterval)
    simulationInterval = null
  }
  if (initialTimeout) {
    clearTimeout(initialTimeout)
    initialTimeout = null
  }
  // Очищаем все вложенные таймеры симуляции
  simulationTimeouts.forEach(timeoutId => {
    clearTimeout(timeoutId)
  })
  simulationTimeouts = []
  
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
  // Очищаем интервал и таймер симуляции
  if (simulationInterval) {
    clearInterval(simulationInterval)
    simulationInterval = null
  }
  if (initialTimeout) {
    clearTimeout(initialTimeout)
    initialTimeout = null
  }
  // Очищаем все вложенные таймеры симуляции
  simulationTimeouts.forEach(timeoutId => {
    clearTimeout(timeoutId)
  })
  simulationTimeouts = []
  
  // Очищаем обработчики событий
  document.removeEventListener('mousemove', handleDrag)
  document.removeEventListener('mouseup', endDrag)
  document.removeEventListener('touchmove', handleDrag)
  document.removeEventListener('touchend', endDrag)
})

// Функция для имитации драга джойстика: влево вниз → вверх → возврат в центр
const simulateDrag = async () => {
  if (isDragging.value || isSimulating.value || isUserInteracting.value) return // Если уже идет драг, симуляция или пользователь взаимодействует, не запускаем новый
  
  // Начинаем симуляцию
  isSimulating.value = true
  isDragging.value = true
  
  // Очищаем предыдущие таймеры симуляции
  simulationTimeouts.forEach(timeoutId => {
    clearTimeout(timeoutId)
  })
  simulationTimeouts = []
  
  // Устанавливаем начальную позицию (центр)
  currentPosition.value = { x: 0, y: 0 }
  emitAimChange()
  
  // Вычисляем позиции
  const maxDistance = outerRadius.value - innerRadius.value
  // Для движения по осям (влево-вправо, вверх-вниз) используем радиус / √2
  // Это обеспечивает, что джойстик касается границы круга, а не выходит за неё
  const axisDistance = maxDistance / Math.sqrt(2)
  
  const leftBottomX = -axisDistance // Максимально влево (по оси X)
  const leftBottomY = axisDistance  // Максимально вниз (по оси Y)
  const leftTopY = -axisDistance    // Максимально вверх (по оси Y)
  
  const moveDuration = 1000 // 1.5 секунды на движение
  const pauseDuration = 700 // 1 секунда паузы между движениями
  
  // 1. Движение влево вниз
  const startTime1 = Date.now()
  const startX1 = 0
  const startY1 = 0
  
  const animateToLeftBottom = () => {
    const elapsed = Date.now() - startTime1
    const progress = Math.min(elapsed / moveDuration, 1)
    
    // Используем easeOut для плавного замедления
    const easeProgress = 1 - Math.pow(1 - progress, 3)
    
    // Интерполируем позицию
    const currentX = startX1 + (leftBottomX - startX1) * easeProgress
    const currentY = startY1 + (leftBottomY - startY1) * easeProgress
    
    currentPosition.value = { x: currentX, y: currentY }
    emitAimChange()
    
    if (progress < 1) {
      requestAnimationFrame(animateToLeftBottom)
    } else {
      // Пауза перед вторым движением
      const timeoutId1 = setTimeout(() => {
        // 2. Движение вверх (X остается тем же)
        const startTime2 = Date.now()
        const startX2 = currentPosition.value.x
        const startY2 = currentPosition.value.y
        
        const animateToLeftTop = () => {
          const elapsed = Date.now() - startTime2
          const progress = Math.min(elapsed / moveDuration, 1)
          
          // Используем easeOut для плавного замедления
          const easeProgress = 1 - Math.pow(1 - progress, 3)
          
          // Интерполируем позицию (X остается тем же)
          const currentX = startX2 // X не меняется
          const currentY = startY2 + (leftTopY - startY2) * easeProgress
          
          currentPosition.value = { x: currentX, y: currentY }
          emitAimChange()
          
          if (progress < 1) {
            requestAnimationFrame(animateToLeftTop)
          } else {
            // Пауза перед третьим движением
            const timeoutId2 = setTimeout(() => {
              // 3. Возврат в центр
              const startTime3 = Date.now()
              const startX3 = currentPosition.value.x
              const startY3 = currentPosition.value.y
              
              const animateToCenter = () => {
                const elapsed = Date.now() - startTime3
                const progress = Math.min(elapsed / moveDuration, 1)
                
                // Используем easeOut для плавного замедления
                const easeProgress = 1 - Math.pow(1 - progress, 3)
                
                // Интерполируем позицию обратно в центр
                const currentX = startX3 + (0 - startX3) * easeProgress
                const currentY = startY3 + (0 - startY3) * easeProgress
                
                currentPosition.value = { x: currentX, y: currentY }
                emitAimChange()
                
                if (progress < 1) {
                  requestAnimationFrame(animateToCenter)
                } else {
                  // Анимация завершена, завершаем симуляцию без выстрела
                  isSimulating.value = false
                  isDragging.value = false
                  currentPosition.value = { x: 0, y: 0 }
                  emitAimChange()
                }
              }
              
              requestAnimationFrame(animateToCenter)
            }, pauseDuration)
            simulationTimeouts.push(timeoutId2)
          }
        }
        
        requestAnimationFrame(animateToLeftTop)
      }, pauseDuration)
      simulationTimeouts.push(timeoutId1)
    }
  }
  
  // Небольшая задержка для корректного отображения начальной позиции
  setTimeout(() => {
    requestAnimationFrame(animateToLeftBottom)
  }, 50)
}

// Экспонируем методы для использования из родительского компонента
defineExpose({
  startDragFromAnywhere,
  simulateDrag
})

onMounted(() => {
  // Запускаем первую симуляцию через 1 секунду
  initialTimeout = setTimeout(() => {
    simulateDrag()
  }, 1000)
  
  // Затем запускаем цикличную симуляцию каждые 6 секунд (4.4с симуляция + 1.6с пауза)
  simulationInterval = setInterval(() => {
    if (!isUserInteracting.value) {
      simulateDrag()
    }
  }, 6000)
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
