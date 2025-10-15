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
          'prizes__gift--falling': prize.falling && !prize.isBad,
          'prizes__gift--bad': prize.isBad,
          'prizes__gift--bad-disappearing': prize.falling && prize.isBad
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
import { computed, ref, onMounted, } from 'vue'
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
  const result: Prize[] = []
  
  // Сначала размещаем хорошие призы равномерно
  const goodPrizes = generateGoodPrizes(goodPrizesCount)
  
  // Затем размещаем плохие призы вокруг хороших
  const badPrizes = generateBadPrizes(badPrizesCount, goodPrizes)
  
  // Объединяем все призы
  result.push(...goodPrizes, ...badPrizes)
  
  prizesData.value = result
}

// Генерируем хорошие призы с равномерным распределением
const generateGoodPrizes = (count: number): Prize[] => {
  const prizes: Prize[] = []
  const minDistance = 15 // Минимальное расстояние между призами в процентах
  const maxAttempts = 100 // Максимальное количество попыток размещения
  
  for (let i = 0; i < count; i++) {
    let attempts = 0
    let position: { top: number; left: number } | null = null
    
    while (attempts < maxAttempts) {
      let candidateTop: number
      let candidateLeft: number
      
      // Проверяем, есть ли уже призы в левой части (15-40% по ширине)
      const hasLeftPrize = prizes.some(prize => prize.leftPosition >= 15 && prize.leftPosition <= 40)
      
      // Если нет призов слева и это последний приз, принудительно размещаем слева
      if (!hasLeftPrize && i === count - 1) {
        candidateTop = 15 + Math.random() * 25 // 15-40% по высоте
        candidateLeft = 15 + Math.random() * 25 // 15-40% по ширине (левая часть)
      } else {
        candidateTop = 15 + Math.random() * 25 // 15-40% по высоте
        candidateLeft = 15 + Math.random() * 70 // 15-85% по ширине
      }
      
      // Проверяем, не слишком ли близко к другим призам
      const tooClose = prizes.some(prize => {
        const distance = Math.sqrt(
          Math.pow(prize.leftPosition - candidateLeft, 2) + 
          Math.pow(parseFloat(prize.style.top) - candidateTop, 2)
        )
        return distance < minDistance
      })
      
      if (!tooClose) {
        position = { top: candidateTop, left: candidateLeft }
        break
      }
      
      attempts++
    }
    
    // Если не удалось найти подходящее место, размещаем случайно
    if (!position) {
      // Проверяем, есть ли уже призы в левой части
      const hasLeftPrize = prizes.some(prize => prize.leftPosition >= 15 && prize.leftPosition <= 40)
      
      // Если нет призов слева, принудительно размещаем слева
      if (!hasLeftPrize) {
        position = {
          top: 15 + Math.random() * 25,
          left: 15 + Math.random() * 25
        }
      } else {
        position = {
          top: 15 + Math.random() * 25,
          left: 15 + Math.random() * 70
        }
      }
    }
    
    prizes.push({
      style: {
        top: `${position.top}%`,
        left: `${position.left}%`
      },
      visible: true,
      falling: false,
      leftPosition: position.left,
      isBad: false
    })
  }
  
  // Финальная проверка: если все призы размещены и ни одного нет слева, перемещаем один приз влево
  const hasLeftPrize = prizes.some(prize => prize.leftPosition >= 15 && prize.leftPosition <= 40)
  if (!hasLeftPrize && prizes.length > 0) {
    // Находим приз, который можно переместить влево
    const prizeToMove = prizes.find(prize => prize.leftPosition > 40)
    if (prizeToMove) {
      prizeToMove.leftPosition = 15 + Math.random() * 25
      prizeToMove.style.left = `${prizeToMove.leftPosition}%`
    }
  }
  
  return prizes
}

// Генерируем плохие призы вокруг хороших
const generateBadPrizes = (count: number, goodPrizes: Prize[]): Prize[] => {
  const prizes: Prize[] = []
  const minDistance = 12 // Минимальное расстояние между призами
  const maxAttempts = 150
  
  for (let i = 0; i < count; i++) {
    let attempts = 0
    let position: { top: number; left: number } | null = null
    
    while (attempts < maxAttempts) {
      // Выбираем случайный хороший приз для размещения рядом
      const targetPrize = goodPrizes[Math.floor(Math.random() * goodPrizes.length)]
      if (!targetPrize) break // Если нет хороших призов, выходим
      
      const targetTop = parseFloat(targetPrize.style.top)
      const targetLeft = targetPrize.leftPosition
      
      // Определяем направление размещения (левее, правее, выше, ниже)
      const directions = ['left', 'right', 'top', 'bottom']
      const direction = directions[Math.floor(Math.random() * directions.length)]
      
      let candidateTop: number
      let candidateLeft: number
      
      switch (direction) {
        case 'left':
          candidateTop = targetTop + (Math.random() - 0.5) * 20 // ±10% по вертикали
          candidateLeft = Math.max(5, targetLeft - 20 - Math.random() * 15) // левее на 20-35%
          break
        case 'right':
          candidateTop = targetTop + (Math.random() - 0.5) * 20
          candidateLeft = Math.min(90, targetLeft + 20 + Math.random() * 15) // правее на 20-35%
          break
        case 'top':
          candidateTop = Math.max(5, targetTop - 15 - Math.random() * 10) // выше на 15-25%
          candidateLeft = targetLeft + (Math.random() - 0.5) * 20 // ±10% по горизонтали
          break
        case 'bottom':
          candidateTop = Math.min(45, targetTop + 15 + Math.random() * 10) // ниже на 15-25%
          candidateLeft = targetLeft + (Math.random() - 0.5) * 20
          break
        default:
          candidateTop = targetTop + (Math.random() - 0.5) * 20
          candidateLeft = targetLeft + (Math.random() - 0.5) * 20
      }
      
      // Ограничиваем позиции в пределах игровой области
      candidateTop = Math.max(5, Math.min(45, candidateTop))
      candidateLeft = Math.max(5, Math.min(90, candidateLeft))
      
      // Проверяем, не слишком ли близко к другим призам
      const allPrizes = [...goodPrizes, ...prizes]
      const tooClose = allPrizes.some(prize => {
        const distance = Math.sqrt(
          Math.pow(prize.leftPosition - candidateLeft, 2) + 
          Math.pow(parseFloat(prize.style.top) - candidateTop, 2)
        )
        return distance < minDistance
      })
      
      if (!tooClose) {
        position = { top: candidateTop, left: candidateLeft }
        break
      }
      
      attempts++
    }
    
    // Если не удалось найти подходящее место, размещаем случайно
    if (!position) {
      position = {
        top: 5 + Math.random() * 40,
        left: 5 + Math.random() * 85
      }
    }
    
    prizes.push({
      style: {
        top: `${position.top}%`,
        left: `${position.left}%`
      },
      visible: true,
      falling: false,
      leftPosition: position.left,
      isBad: true
    })
  }
  
  return prizes
}

// Инициализируем только на клиенте после монтирования
onMounted(() => {
  initializePrizes()
})

// Убираем автоматическое обновление призов при изменении настроек
// Теперь призы обновляются только при вызове resetPrizes() или initializePrizes()

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
        
        // Скрываем подарок после завершения анимации
        const animationDuration = prizeData.isBad ? 1200 : 1500 // Плохие призы исчезают быстрее
        setTimeout(() => {
          prizeData.visible = false
        }, animationDuration)
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
    width: 14%;
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
      filter: grayscale(0.4) brightness(0.7) saturate(0.8);
      opacity: 0.9;
      z-index: 99; // Немного ниже хороших призов
      width: 10%;
    }
    
    &--bad-disappearing {
      animation: badPrizeDisappear 1.2s ease-out forwards;
    }
  }
}

@keyframes prizeFall {
  0% {
    transform: translateY(0) rotate(0deg) scale(1);
    opacity: 1;
  }
  80% {
    transform: translateY(620%) rotate(360deg) scale(0.7);
    opacity: 1;
  }
  100% {
    transform: translateY(620%) rotate(0deg) scale(0.3);
    opacity: 0;
  }
}

@keyframes badPrizeDisappear {
  0% {
    transform: rotate(0deg) scale(1);
    opacity: 0.9;
  }
  50% {
    transform: rotate(180deg) scale(1.1);
    opacity: 0.6;
  }
  100% {
    transform: rotate(360deg) scale(0);
    opacity: 0;
  }
}
</style>