<template>
  <div class="archer-man">
    
    <div class="archer-man__content">
      <div class="archer-man__body">
        <ArcherManBody />
      </div>
      <div class="archer-man__legs">
        <ArcherManLegs />
      </div>
      <div v-if="!isShooting" class="archer-man__arrow" :style="arrowStyle">
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

      <div class="archer-man__line" :style="lineStyle">
        <ArcherImagesLine ref="lineRef" :power="displayPower" :direction="displayDirection" />
        
        <!-- Летящая стрела прямо внутри SVG -->
        <svg v-if="isShooting" ref="flyingArrowRef" class="flying-arrow-svg" :style="flyingSvgStyle">
          <defs>
            <path :id="pathId" :d="flyingPathData" />
          </defs>
          <g ref="flyingArrowGroup">
            <foreignObject :width="arrowWidth" :height="arrowHeight" class="arrow-foreign-object">
              <ArcherManArrow />
            </foreignObject>
            <animateMotion 
              :dur="`${animationDuration}ms`"
              rotate="auto"
              fill="freeze"
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
import { ref, computed, inject } from 'vue'

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
const frozenAimPosition = ref({ x: 0, y: 0, power: 0 })
const animationDuration = ref(1500) // Длительность анимации в мс
const pathId = ref('arrow-path-' + Math.random().toString(36).substr(2, 9)) // Уникальный ID для path
const lineRef = ref<{ 
  pathData: string,
  svgWidth: number,
  svgHeight: number
} | null>(null)
const flyingArrowRef = ref<SVGSVGElement | null>(null)
const animationFrameId = ref<number | null>(null)

// Для отображения используем либо текущую позицию, либо замороженную
const displayPower = computed(() => isShooting.value ? frozenAimPosition.value.power : aimPosition.value.power)
const displayDirection = computed(() => isShooting.value ? frozenAimPosition.value.x : aimPosition.value.x)

// Базовые позиции компонентов
const basePositions = {
  hand: { x: 2, y: 49 },
  hand2: { x: 14, y: 23 },
  arrow: { x: 20, y: 35 }
}

// Вычисляемые позиции с учетом прицела
const handStyle = computed(() => {
  // Левая рука движется влево при натяжении и следует движению джойстика
  const powerOffset = aimPosition.value.power * 2.5 // Максимум 10% влево при натяжении
  const horizontalOffset = aimPosition.value.x * 2.5 // Движение влево/вправо (отрицательный x = влево, положительный = вправо)
  
  return {
    left: `${basePositions.hand.x - powerOffset + horizontalOffset}%`, // + потому что x отрицательный при движении влево
    top: `${basePositions.hand.y}%`,
    transformOrigin: 'right center',
    transform: `rotate(${-aimPosition.value.y * 5}deg)` // Инвертировано: отрицательный y = вверх
  }
})

const hand2Style = computed(() => {
  // Правая рука (лук) НЕ движется, только вращается от точки плеча
  // Вращение зависит от горизонтального и вертикального прицеливания
  const horizontalRotation = aimPosition.value.x * 10 // Поворот при горизонтальном прицеливании
  const verticalRotation = -aimPosition.value.y * 6 // Инвертировано: отрицательный y = вверх
  
  return {
    left: `${basePositions.hand2.x}%`,
    top: `${basePositions.hand2.y}%`,
    transform: `rotate(${horizontalRotation + verticalRotation}deg)`,
    transformOrigin: 'left center' // Вращение от левой точки (плеча)
  }
})

const arrowStyle = computed(() => {
  // Стрела движется вместе с рукой и вращается вместе с луком
  const powerOffset = aimPosition.value.power * 2.5 // Движение влево при натяжении
  const horizontalOffset = aimPosition.value.x * 2.5 // Движение влево/вправо вместе с рукой
  const rotation = aimPosition.value.x * 15 - aimPosition.value.y * 16 // Инвертировано вертикальное вращение
  
  return {
    left: `${basePositions.arrow.x - powerOffset + horizontalOffset}%`, // + потому что x отрицательный при движении влево
    top: `${basePositions.arrow.y}%`,
    transform: `rotate(${rotation}deg)`,
    transformOrigin: 'left center',
  }
})

const lineStyle = computed(() => {
  // Используем замороженную позицию, если стреляем, иначе текущую
  const currentAim = isShooting.value ? frozenAimPosition.value : aimPosition.value
  
  // Скрываем траекторию, пока джойстик не начали двигать
  const isJoystickActive = currentAim.x !== 0 || currentAim.y !== 0 || currentAim.power > 0
  
  if (!isJoystickActive) {
    return {
      opacity: 0,
      pointerEvents: 'none' as const
    }
  }
  
  // Линия траектории выходит из кончика стрелы
  // Плавная зависимость: влево = сильное, вправо = слабое (без резких переходов)
  const directionMultiplier = 0.2 + ((currentAim.x + 1) * 0.4) // От 0.2 (вправо) до 1 (влево), точка отсчёта справа
  const powerOffset = currentAim.power * directionMultiplier * 2.5
  const horizontalOffset = currentAim.x * 2.5
  let rotation = currentAim.x * 25 - currentAim.y * 60 // Инвертировано вертикальное вращение
  
  if (rotation > 20) {
    rotation = rotation * 0.1 - currentAim.y * 1
  }

  // Кончик стрелы находится справа от её позиции (стрела длиной 50%)
  const arrowTipOffset = 50 // 50% ширины стрелы
  
  return {
    left: `${basePositions.arrow.x - powerOffset + horizontalOffset + arrowTipOffset}%`,
    top: `${basePositions.arrow.y - 21}%`, // Поднимаем вверх, чтобы совпадало с кончиком стрелы
    transform: `rotate(${rotation}deg) translateY(${rotation * 0.8}%) translateX(${- rotation * 1.2}%)`,
    transformOrigin: 'left left', // Вращение от точки начала траектории
    pointerEvents: 'none' as const
  }
})

// Path данные для анимации стрелы (берем из lineRef)
const flyingPathData = computed(() => {
  if (lineRef.value && lineRef.value.pathData) {
    return lineRef.value.pathData
  }
  return ''
})

// Стиль для SVG с летящей стрелой
const flyingSvgStyle = computed(() => {
  if (!lineRef.value) return {}
  
  return {
    position: 'absolute' as const,
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    overflow: 'visible',
    pointerEvents: 'none' as const,
    zIndex: '200'
  }
})

// Размеры стрелы для foreignObject с учетом scale
const arrowWidth = computed(() => {
  // Базовая ширина для scale=1 (800px контейнер)
  const baseWidth = 100
  return Math.round(baseWidth * gameScale.value)
})

const arrowHeight = computed(() => {
  // Базовая высота для scale=1 (800px контейнер)
  const baseHeight = 30
  return Math.round(baseHeight * gameScale.value)
})

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
  
  // Если попали в цель, останавливаем стрелу
  if (hitTarget) {
    resetAfterShot()
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
  aimPosition.value = { x: 0, y: 0, power: 0 }
  frozenAimPosition.value = { x: 0, y: 0, power: 0 }
}

// Обработчик изменения прицела
const handleAimChange = (position: { x: number, y: number, power: number }) => {
  if (!isShooting.value) {
    aimPosition.value = position
  }
}

// Функция выстрела
const shoot = (position: { x: number, y: number, power: number }) => {
  if (isShooting.value) return
  
  // Замораживаем текущую позицию
  frozenAimPosition.value = { ...position }
  
  // Длительность полёта зависит от силы (0.8-2 секунды)
  const duration = 800 + (1 - position.power) * 1200
  animationDuration.value = duration
  
  isShooting.value = true
  
  // Запускаем проверку коллизий
  setTimeout(() => {
    checkCollisionDuringFlight()
  }, 50) // Небольшая задержка для инициализации SVG
  
  // Сбрасываем позицию после окончания анимации
  setTimeout(() => {
    resetAfterShot()
  }, duration + 500)
}

// Экспортируем функции для внешнего использования
defineExpose({
  handleAimChange,
  shoot
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
    width: 50%;
    z-index: 1;
    transition: all 0.1s ease-out;
    pointer-events: none; // Линия не должна перехватывать клики
  }

  &__flying-arrow {
    position: absolute;
    width: 50%;
    z-index: 200;
    pointer-events: none;
  }
}

.flying-arrow-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
  pointer-events: none;
  z-index: 200;
}

.arrow-foreign-object {
  overflow: visible;
  transform: rotate(29deg) translateY(-30%);
}

</style>  