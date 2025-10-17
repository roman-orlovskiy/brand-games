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
        <ArcherImagesLine ref="lineRef" :power="displayPower" :direction="displayDirection" :aim-position="displayAimPosition" />
        
        <!-- Летящая стрела прямо внутри SVG -->
        <svg v-if="isShooting" ref="flyingArrowRef" class="flying-arrow-svg" :style="flyingSvgStyle">
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
import { ref, computed, inject, nextTick } from 'vue'

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

// Единая точка вращения для arrow и line
const rotationPoint = { x: 25, y: 35 } // Общая точка слева для вращения

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
  const rotation = -aimPosition.value.y * 40 + aimPosition.value.x * 20

  return {
    left: `${basePositions.hand2.x}%`,
    top: `${basePositions.hand2.y}%`,
    transform: `rotate(${rotation}deg)`,
    transformOrigin: '25% 65%' // Вращение от левой точки (плеча)
  }
})


const arrowStyle = computed(() => {
  // Стрела движется вместе с рукой и вращается вместе с луком
  const powerOffset = aimPosition.value.power * 2.5 // Движение влево при натяжении
  const horizontalOffset = aimPosition.value.x * 2.5 // Движение влево/вправо вместе с рукой
  const rotation = -aimPosition.value.y * 40 + aimPosition.value.x * 20 // Инвертировано вертикальное вращение
  
  return {
    left: `${basePositions.arrow.x - powerOffset + horizontalOffset}%`, // + потому что x отрицательный при движении влево
    top: `${basePositions.arrow.y}%`,
    transform: `rotate(${rotation}deg)`,
    transformOrigin: '20% 80%',
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
  
  // Устанавливаем прозрачность в зависимости от направления прицеливания
  // Если джойстик отклонен вверх (отрицательный Y) - делаем линию прозрачной
  const isAimingUp = currentAim.y < -0.5
  const lineOpacity = isAimingUp ? 0 : 1
  
  // Линия траектории начинается из единой точки вращения
  // Плавная зависимость: влево = сильное, вправо = слабое (без резких переходов)
  const directionMultiplier = 0.2 + ((currentAim.x + 1) * 0.4) // От 0.2 (вправо) до 1 (влево), точка отсчёта справа
  const powerOffset = currentAim.power * directionMultiplier * 2.5
  const horizontalOffset = currentAim.x * 2.5
  const rotation = -currentAim.y * 10 + currentAim.x * 20 // Инвертировано вертикальное вращение

  // Линия начинается из единой точки вращения (кончик стрелы)
  const lineOffsetFromRotationPoint = 5 // Линия начинается на 5% правее точки вращения (кончик стрелы)
  
  return {
    left: `${rotationPoint.x + lineOffsetFromRotationPoint - powerOffset + horizontalOffset}%`,
    top: `${rotationPoint.y - 21}%`, // Поднимаем вверх, чтобы совпадало с кончиком стрелы
    transform: `rotate(${rotation}deg)`,
    transformOrigin: 'left center', // Вращение от единой точки (левая сторона линии)
    opacity: lineOpacity,
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

// Стиль для группы стрелы - скрываем до начала анимации
const arrowGroupStyle = computed(() => {
  return {
    opacity: animationStarted.value ? '1' : '0'
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
  animationStarted.value = false
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
const shoot = async (position: { x: number, y: number, power: number }) => {
  if (isShooting.value) return
  
  // Запрещаем выстрел, если джойстик отклонен вверх (Y меньше -0.5)
  if (position.y < -0.5) return
  
  // Замораживаем текущую позицию
  frozenAimPosition.value = { ...position }
  
  // Длительность полёта зависит от силы (0.8-2 секунды)
  const duration = 800 + (1 - position.power) * 1200
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