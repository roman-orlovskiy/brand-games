<template>
  <div ref="prizesContainerRef" class="prizes">
    <div class="prizes__inner">
      <div 
        v-for="(prize, index) in prizes" 
        :key="index" 
        ref="prizeRefs"
        class="prizes__gift"
        :class="{ 
          'prizes__gift--hidden': !prize.visible, 
          'prizes__gift--falling': prize.falling,
          'prizes__gift--bad': prize.isBad
        }"
        :style="prize.style"
      >
        <ArcherImagesGift v-if="!prize.isBad" />
        <ArcherImagesTrash v-else />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useSettingsStore } from '~/stores/settings'

const settingsStore = useSettingsStore()
const prizesContainerRef = ref<HTMLElement | null>(null)
const prizeRefs = ref<HTMLElement[]>([])

interface Prize {
  style: {
    top: string
    left: string
  }
  visible: boolean
  falling: boolean
  leftPosition: number // Позиция в процентах для передачи в корзину
  isBad: boolean // Флаг плохого приза (мусор)
}

// Генерируем рандомные позиции для подарков
const prizesData = ref<Prize[]>([])

const initializePrizes = () => {
  const goodPrizesCount = settingsStore.gameSettings.prizesCount
  const badPrizesCount = settingsStore.gameSettings.badPrizesCount
  const totalCount = goodPrizesCount + badPrizesCount
  const result: Prize[] = []
  
  // Создаем массив индексов для случайного распределения
  const indices = Array.from({ length: totalCount }, (_, i) => i)
  
  // Перемешиваем индексы
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]]
  }
  
  // Первые badPrizesCount индексов будут плохими призами
  const badPrizeIndices = new Set(indices.slice(0, badPrizesCount))
  
  for (let i = 0; i < totalCount; i++) {
    // Генерируем позиции в верхней части (10-40% по высоте)
    // И распределяем по ширине (10-90%)
    const leftPos = 10 + Math.random() * 80
    const isBad = badPrizeIndices.has(i)
    
    result.push({
      style: {
        top: `${10 + Math.random() * 30}%`,
        left: `${leftPos}%`
      },
      visible: true,
      falling: false,
      leftPosition: leftPos,
      isBad
    })
  }
  
  prizesData.value = result
}

// Инициализируем только на клиенте после монтирования
onMounted(() => {
  initializePrizes()
})

const prizes = computed(() => prizesData.value)

// Функция для проверки коллизии с точкой
const checkCollision = (x: number, y: number, onPrizeHit?: (leftPosition: number, isBad: boolean) => void): boolean => {
  if (!prizesContainerRef.value || !prizeRefs.value.length) return false
  
  for (let i = 0; i < prizeRefs.value.length; i++) {
    const prizeElement = prizeRefs.value[i]
    const prize = prizes.value[i]
    if (!prizeElement || !prize || !prize.visible) continue
    
    const prizeRect = prizeElement.getBoundingClientRect()
    
    // Проверяем, попадает ли точка в границы подарка
    if (
      x >= prizeRect.left &&
      x <= prizeRect.right &&
      y >= prizeRect.top &&
      y <= prizeRect.bottom
    ) {
      // Запускаем падение подарка
      const prizeData = prizesData.value[i]
      if (prizeData) {
        prizeData.falling = true
        
        // Вызываем колбэк с позицией подарка и информацией о том, плохой ли он
        if (onPrizeHit) {
          onPrizeHit(prizeData.leftPosition, prizeData.isBad)
        }
        
        // Скрываем подарок после завершения анимации падения
        setTimeout(() => {
          prizeData.visible = false
        }, 1500) // Длительность анимации падения
      }
      return true
    }
  }
  
  return false
}

// Функция для сброса всех подарков
const resetPrizes = () => {
  initializePrizes()
}

// Экспортируем функции для внешнего использования
defineExpose({
  checkCollision,
  resetPrizes
})
</script>

<style scoped lang="scss">
.prizes {
  width: 100%;
  padding-bottom: 50%;
  position: relative;

  &__inner {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  &__gift {
    width: 10%;
    position: absolute;
    z-index: 100;
    opacity: 1;
    transform: scale(1);
    transition: opacity 0.3s ease-out, transform 0.3s ease-out;
    
    &--falling {
      animation: prizeFall 1.5s cubic-bezier(0.5, 0, 0.75, 0) forwards;
    }
    
    &--hidden {
      opacity: 0;
      pointer-events: none;
    }
    
    &--bad {
      filter: grayscale(0.3) brightness(0.8);
    }
  }
}

@keyframes prizeFall {
  0% {
    transform: translateY(0) rotate(0deg) scale(1);
    opacity: 1;
  }
  70% {
    transform: translateY(350px) rotate(270deg) scale(0.8);
    opacity: 0.6;
  }
  100% {
    transform: translateY(450px) rotate(360deg) scale(0.3);
    opacity: 0;
  }
}
</style>