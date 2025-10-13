<template>
  <div class="archer-man">
    
    <div class="archer-man__content">
      <div class="archer-man__body">
        <ArcherManBody />
      </div>
      <div class="archer-man__legs">
        <ArcherManLegs />
      </div>
      <div class="archer-man__arrow" :style="arrowStyle">
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
        <ArcherImagesLine :power="aimPosition.power" :direction="aimPosition.x" />
      </div>
    </div>
  </div>
  </template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// Позиция прицела и сила натяжения
const aimPosition = ref({ x: 0, y: 0, power: 0 })

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
    opacity: 0.7 + (aimPosition.value.power * 0.3) // Более видимая при натяжении
  }
})

const lineStyle = computed(() => {
  // Скрываем траекторию, пока джойстик не начали двигать
  const isJoystickActive = aimPosition.value.x !== 0 || aimPosition.value.y !== 0 || aimPosition.value.power > 0
  
  if (!isJoystickActive) {
    return {
      opacity: 0,
      pointerEvents: 'none' as const
    }
  }
  
  // Линия траектории выходит из кончика стрелы
  // Плавная зависимость: влево = сильное, вправо = слабое (без резких переходов)
  const directionMultiplier = 0.2 + ((aimPosition.value.x + 1) * 0.4) // От 0.2 (вправо) до 1 (влево), точка отсчёта справа
  const powerOffset = aimPosition.value.power * directionMultiplier * 2.5
  const horizontalOffset = aimPosition.value.x * 2.5
  let rotation = aimPosition.value.x * 25 - aimPosition.value.y * 60 // Инвертировано вертикальное вращение
  
  if (rotation > 20) {
    rotation = rotation * 0.1 - aimPosition.value.y * 1
  }

  // Кончик стрелы находится справа от её позиции (стрела длиной 50%)
  const arrowTipOffset = 50 // 50% ширины стрелы
  
  return {
    left: `${basePositions.arrow.x - powerOffset + horizontalOffset + arrowTipOffset}%`,
    top: `${basePositions.arrow.y - 21}%`, // Поднимаем вверх, чтобы совпадало с кончиком стрелы
    transform: `rotate(${rotation}deg) translateY(${rotation * 0.8}%) translateX(${- rotation * 1.2}%)`,
    transformOrigin: 'left left', // Вращение от точки начала траектории
    opacity: 0.5 + (aimPosition.value.power * directionMultiplier * 0.3), // Видимость зависит от направления натяжения
    pointerEvents: 'none' as const
  }
})

// Обработчик изменения прицела
const handleAimChange = (position: { x: number, y: number, power: number }) => {
  aimPosition.value = position
}

// Экспортируем функцию для внешнего использования
defineExpose({
  handleAimChange
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
}
</style>  