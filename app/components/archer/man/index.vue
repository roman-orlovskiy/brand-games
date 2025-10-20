<template>
  <div class="archer-man">
    
    <div class="archer-man__content">
      <div class="archer-man__body">
        <ArcherManBody />
      </div>
      <div class="archer-man__legs">
        <ArcherManLegs />
      </div>
      <div v-if="!isShooting" ref="arrowInBowRef" class="archer-man__arrow" :style="arrowStyle">
        <ArcherManArrow />
      </div>
      <div class="archer-man__hand" :style="handStyle">
        <ArcherManHand />
      </div>
      <div class="archer-man__hand2" :style="hand2Style">
        <ArcherManHand2 />
      </div>
      <div class="archer-man__arrows">
        <ArcherManArrows />
      </div>

      <div class="archer-man__line">
        <ArcherImagesLine ref="lineRef" :power="displayPower" :direction="displayDirection" :aim-position="displayAimPosition" />
        
        <!-- Летящая стрела прямо внутри SVG -->
        <svg ref="flyingArrowRef" viewBox="0 0 1200 700" >
          <defs>
            <path :id="pathId" :d="flyingPathData" />
          </defs>
          <g ref="flyingArrowGroup" :style="arrowGroupStyle">
            <foreignObject :width="arrowWidth" :height="arrowHeight" class="arrow-foreign-object">
              <ArcherManArrow />
            </foreignObject>
            <animateMotion 
              ref="animateMotionRef"
              :dur="`${animationDuration}ms`"
              rotate="auto"
              fill="freeze"
              begin="indefinite"
            >
              <mpath :href="`#${pathId}`" />
            </animateMotion>
          </g>
        </svg>
      </div>
    </div>
  </div>
  </template>

<script setup lang="ts">
import { ref, computed, inject, nextTick, onMounted, onUnmounted } from 'vue'

// Пропс для функции проверки коллизий
interface Props {
  onCollisionCheck?: (x: number, y: number) => boolean
}

const props = withDefaults(defineProps<Props>(), {
  onCollisionCheck: undefined
})

// Получаем scale из родительского компонента (800px = scale 1)
const gameScale = inject<{ value: number }>('gameScale', { value: 1 })

// Позиция прицела и сила натяжения
const aimPosition = ref({ x: 0, y: 0, power: 0 })

// Состояние выстрела
const isShooting = ref(false)
const animationStarted = ref(false) // Флаг для отслеживания старта анимации
const frozenAimPosition = ref({ x: 0, y: 0, power: 0 })
const animationDuration = ref(1500) // Длительность анимации в мс
const pathId = ref('arrow-path-' + Math.random().toString(36).substr(2, 9)) // Уникальный ID для path
const lineRef = ref<{ 
  pathData: string,
  svgWidth: number,
  svgHeight: number
} | null>(null)
const flyingArrowRef = ref<SVGSVGElement | null>(null)
const animateMotionRef = ref<SVGAnimateMotionElement | null>(null)
const animationFrameId = ref<number | null>(null)
const arrowOpacity = ref(0) // Прозрачность летящей стрелы (для плавного исчезновения)
const arrowInBowRef = ref<HTMLElement | null>(null)

// Для отображения используем либо текущую позицию, либо замороженную
const displayPower = computed(() => isShooting.value ? frozenAimPosition.value.power : aimPosition.value.power)
const displayDirection = computed(() => isShooting.value ? frozenAimPosition.value.x : aimPosition.value.x)
const displayAimPosition = computed(() => isShooting.value ? frozenAimPosition.value : aimPosition.value)

// Базовые позиции компонентов
const basePositions = {
  hand: { x: 2, y: 49 },
  hand2: { x: 14, y: 23 },
  arrow: { x: 20, y: 35 }
}


// Вычисляемые позиции с учетом прицела
const handStyle = computed(() => {
  const powerOffset = aimPosition.value.power * 2.5 // Максимум 10% влево при натяжении
  
  return {
    left: `${basePositions.hand.x - powerOffset}%`, // + потому что x отрицательный при движении влево
    top: `${basePositions.hand.y}%`,
    transformOrigin: '0% 70%',
    transform: `rotate(${aimPosition.value.y * 15}deg)` // Инвертировано: отрицательный y = вверх
  }
})

const handArrowRotation = computed(() => {
  return -aimPosition.value.y * 23 - aimPosition.value.x * 25 - 26
})

const hand2Style = computed(() => {
  return {
    left: `${basePositions.hand2.x}%`,
    top: `${basePositions.hand2.y}%`,
    transform: `rotate(${handArrowRotation.value}deg)`,
    transformOrigin: '25% 65%' // Вращение от левой точки (плеча)
  }
})


const arrowStyle = computed(() => {
  // Стрела движется вместе с рукой и вращается вместе с луком
  const powerOffset = aimPosition.value.power * 4.5 // Движение влево при натяжении
  
  return {
    left: `${basePositions.arrow.x - powerOffset}%`, // + потому что x отрицательный при движении влево
    top: `${basePositions.arrow.y}%`,
    transform: `rotate(${handArrowRotation.value}deg)`,
    transformOrigin: '20% 80%',
  }
})


// Path данные для анимации стрелы (берем из lineRef)
const flyingPathData = computed(() => {
  if (lineRef.value && lineRef.value.pathData) {
    return lineRef.value.pathData
  }
  return ''
})


// Стиль для группы стрелы - скрываем до начала анимации
const arrowGroupStyle = computed(() => {
  return {
    opacity: String(arrowOpacity.value),
    transition: 'opacity 500ms ease'
  }
})

// Функции для получения размеров стрелы для foreignObject
// Получаем реальные размеры стрелы в луке через getBoundingClientRect
const getArrowWidth = () => {
  if (!arrowInBowRef.value) {
    // Fallback размеры если ref не готов
    return Math.round(100)
  }
  
  const rect = arrowInBowRef.value.getBoundingClientRect()
  const realWidth = rect.width * 1.6
  
  return Math.round(realWidth)
}

const getArrowHeight = () => {
  if (!arrowInBowRef.value) {
    // Fallback размеры если ref не готов
    return Math.round(30)
  }
  
  const rect = arrowInBowRef.value.getBoundingClientRect()
  const realHeight = rect.height * 1.6
  
  return Math.round(realHeight)
}

const arrowWidth = ref(0)
const arrowHeight = ref(0)

// Функция для проверки коллизий во время полета стрелы
const checkCollisionDuringFlight = () => {
  if (!isShooting.value || !flyingArrowRef.value || !props.onCollisionCheck) {
    return
  }

  const foreignObject = flyingArrowRef.value.querySelector('foreignObject')
  if (!foreignObject) {
    // Продолжаем проверку в следующем кадре
    if (isShooting.value) {
      animationFrameId.value = requestAnimationFrame(checkCollisionDuringFlight)
    }
    return
  }

  // Получаем bounding box foreignObject относительно viewport
  const arrowRect = foreignObject.getBoundingClientRect()
  
  // Центр стрелы (можно использовать кончик стрелы - правую сторону)
  // Смещение масштабируется вместе с игрой
  const arrowX = arrowRect.right - (10 * gameScale.value) // Кончик стрелы
  const arrowY = arrowRect.top + arrowRect.height / 2 // Центр по вертикали
  
  // Проверяем коллизию
  const hitTarget = props.onCollisionCheck(arrowX, arrowY)
  
  // Если попали в цель, останавливаем стрелу и плавно скрываем
  if (hitTarget) {
    // Останавливаем анимацию на текущем кадре
    if (flyingArrowRef.value) {
      flyingArrowRef.value.pauseAnimations()
    }

    // Прекращаем дальнейшие проверки коллизий
    if (animationFrameId.value !== null) {
      cancelAnimationFrame(animationFrameId.value)
      animationFrameId.value = null
    }

    // Плавно скрываем стрелу за 500мс и затем сбрасываем состояние
    arrowOpacity.value = 0
    setTimeout(() => {
      resetAfterShot()
    }, 500)
    return
  }

  // Продолжаем проверку в следующем кадре
  if (isShooting.value) {
    animationFrameId.value = requestAnimationFrame(checkCollisionDuringFlight)
  }
}

// Обработчик окончания анимации
const resetAfterShot = () => {
  // Отменяем проверку коллизий
  if (animationFrameId.value !== null) {
    cancelAnimationFrame(animationFrameId.value)
    animationFrameId.value = null
  }
  
  isShooting.value = false
  animationStarted.value = false
  arrowOpacity.value = 0
  aimPosition.value = { x: 0, y: 0, power: 0 }
  frozenAimPosition.value = { x: 0, y: 0, power: 0 }
  // Возобновляем SVG таймлайн для будущих выстрелов
  if (flyingArrowRef.value) {
    try { flyingArrowRef.value.unpauseAnimations() } catch { void 0 }
  }
}

// Обработчик изменения прицела
const handleAimChange = (position: { x: number, y: number, power: number }) => {
  if (!isShooting.value) {
    aimPosition.value = position
  }
}

// Функция выстрела
const shoot = async (position: { x: number, y: number, power: number }) => {
  if (isShooting.value) return
    
  // Замораживаем текущую позицию
  frozenAimPosition.value = { ...position }
  
  // Длительность полёта зависит от силы: при большей силе летит медленнее (1.2–2.4с)
  const duration = 1200 + position.power * 1000
  animationDuration.value = duration
  
  isShooting.value = true
  animationStarted.value = false // Сбрасываем флаг перед началом
  
  // Ждем обновления DOM перед запуском анимации
  await nextTick()
  
  // Дополнительная задержка для гарантии полного рендера (особенно важно для мобильных)
  setTimeout(() => {
    // Программно запускаем SVG анимацию (необходимо для мобильных браузеров)
    if (animateMotionRef.value) {
      try {
        // Показываем стрелу и сразу запускаем анимацию
        animationStarted.value = true
        arrowOpacity.value = 1
        // На случай, если ранее ставили на паузу таймлайн SVG
        if (flyingArrowRef.value) {
          try { flyingArrowRef.value.unpauseAnimations() } catch { void 0 }
        }
        animateMotionRef.value.beginElement()
      } catch (e) {
        console.warn('Failed to start SVG animation:', e)
      }
    }
    
    // Запускаем проверку коллизий
    checkCollisionDuringFlight()
  }, 50) // Небольшая задержка для инициализации SVG
  
  // Сбрасываем позицию после окончания анимации
  setTimeout(() => {
    // Если стрела еще не была сброшена из-за попадания, сбрасываем по окончанию полёта
    resetAfterShot()
  }, duration + 500)
}

// Экспортируем функции для внешнего использования
defineExpose({
  handleAimChange,
  shoot
})

const updateArrowSize = () => {
  arrowWidth.value = getArrowWidth()
  arrowHeight.value = getArrowHeight()
}

onMounted(() => {
  updateArrowSize()
  document.addEventListener('resize', updateArrowSize)
})

onUnmounted(() => {
  document.removeEventListener('resize', updateArrowSize)
})
</script>

<style scoped lang="scss">
.archer-man {
  width: 100%;
  padding-bottom: 126.93%;
  position: relative;

  &__content {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  // Тело (body): скорректированные размеры и позиция
  &__body {
    position: absolute;
    width: 35%;
    left: 0;
    bottom: 31%;
    z-index: 10;
  }

  // Ноги (legs): скорректированные размеры и позиция
  &__legs {
    position: absolute;
    width: 35%;
    left: 10%;
    bottom: 0;
    z-index: 10;
  }

  // Стрела (arrow): базовые размеры, позиция через динамические стили
  &__arrow {
    position: absolute;
    width: 50%;
    z-index: 15;
    transition: all 0.1s ease-out;
  }

  // Левая рука (hand): базовые размеры, позиция через динамические стили
  &__hand {
    position: absolute;
    width: 26%;
    z-index: 15;
    transition: all 0.1s ease-out;
  }

  // Правая рука (hand2): базовые размеры, позиция через динамические стили
  &__hand2 {
    position: absolute;
    width: 60%;
    z-index: 5;
    transition: all 0.1s ease-out;
  }

  // Стрелы в колчане (arrows): скорректированные размеры и позиция
  &__arrows {
    position: absolute;
    width: 18%;
    left: 3%;
    top: 32%;
    z-index: 1;
  }

  &__line {
    position: absolute;
    width: 450%;
    height: 100%;
    z-index: 1;
    transition: all 0.1s ease-out;
    pointer-events: none;
    top: 0;
    left: 0;

    & > svg {
      width: 100%;
      position: absolute;
      top: -150%;
      left: 7%;
    }
  }

  &__flying-arrow {
    position: absolute;
    width: 50%;
    z-index: 200;
    pointer-events: none;
  }
}

.arrow-foreign-object {
  overflow: visible;
  transform: rotate(29deg) translateY(-14%);
}

</style>  