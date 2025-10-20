<template>
  <div class="box">
    <svg width="100%" viewBox="0 0 255 126" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M37 111C32.2 105.8 16 59 10 30.0003H13.5C13.5 30.0003 241 27 244 30C247 33 223 106 218.5 111C214 116 186.5 125 131.5 125C78.5 125 43 117.5 37 111Z" fill="white" stroke="black"/>
    <path d="M247.009 30.5001C247.009 41.2697 193.283 50.0001 127.009 50.0001C60.7347 50.0001 7.00883 41.2697 7.00883 30.5001C7.00883 28.0271 4.83439 18.177 10.0015 16.0001C27.3368 8.69677 75.9529 11.0001 127.009 11.0001C175.338 11.0001 224.993 9.3098 244.009 16.0002C251.07 18.4845 247.009 27.584 247.009 30.5001Z" :fill="boxColor" stroke="#020201" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M127 0.5C160.119 0.5 190.091 2.68178 211.772 6.20508C222.617 7.96738 231.365 10.0611 237.391 12.376C240.406 13.5344 242.71 14.7379 244.251 15.9619C245.8 17.192 246.5 18.3776 246.5 19.5C246.5 20.6224 245.8 21.808 244.251 23.0381C242.71 24.2621 240.406 25.4656 237.391 26.624C231.365 28.9389 222.617 31.0326 211.772 32.7949C190.091 36.3182 160.119 38.5 127 38.5C93.8813 38.5 63.9095 36.3182 42.2275 32.7949C31.3826 31.0326 22.6346 28.9389 16.6094 26.624C13.5941 25.4656 11.2903 24.2621 9.74902 23.0381C8.2 21.808 7.5 20.6224 7.5 19.5C7.5 18.3776 8.2 17.192 9.74902 15.9619C11.2903 14.7379 13.5941 13.5344 16.6094 12.376C22.6346 10.0611 31.3826 7.96738 42.2275 6.20508C63.9095 2.68178 93.8813 0.5 127 0.5Z" :fill="boxColorLight" stroke="black"/>
    <path d="M17 26.0772C34.969 18.9893 77.8989 14 128 14C178.101 14 221.031 18.9893 239 26.0772" stroke="black"/>
    <path d="M253.504 62.5C250.704 73.3 231.337 77 222.004 77.5C218.404 69.9 223.504 63 226.504 60.5C233.304 60.5 237.004 59.5 238.004 59L242.504 42.5C248.504 44 257.004 49 253.504 62.5Z" :fill="boxColorDark" stroke="#020201" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M1.81649 62.5C4.61649 73.3 23.9832 77 33.3165 77.5C36.9165 69.9 31.8165 63 28.8165 60.5C22.0165 60.5 18.3165 59.5 17.3165 59L12.8165 42.5C6.81649 44 -1.68351 49 1.81649 62.5Z" :fill="boxColorDark" stroke="#020201" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M226.5 60.4998C232.333 60.3331 239.317 60.2317 245.5 55C249.5 51.6154 243.5 46.5002 240.5 46.5" stroke="black"/>
    <path d="M28.8203 60.4998C22.987 60.3331 15.5 60.4998 9.82031 55C6.05606 51.355 11 47.0002 14 47" stroke="black"/>
    </svg>

    <div class="box__gifts">
      <TransitionGroup name="gift" tag="div" class="box__gifts-container">
        <div 
          v-for="gift in collectedGifts" 
          :key="gift.id"
          class="box__gift"
          :style="gift.style"
        >
          <ArcherImagesGift :discount="gift.discount" :image-url="gift.imageUrl" />
        </div>
      </TransitionGroup>
    </div>

    <!-- Анимация скидки при падении подарка -->
    <div v-if="showingDiscount" class="box__discount-animation">
      {{ currentDiscount }}%
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineExpose, computed } from 'vue'
import { useSettingsStore } from '~/stores/settings'
import { storeToRefs } from 'pinia'
import { darkenColor, lightenColor } from '~/utils/colors'

const settingsStore = useSettingsStore()
const { gameSettingsColorsById } = storeToRefs(settingsStore)

const boxColor = computed(() => {
  return gameSettingsColorsById.value.box?.color || '#C27BA0'
})

const boxColorLight = computed(() => {
  return lightenColor(boxColor.value, 30) // Осветляем на 30%
})

const boxColorDark = computed(() => {
  return darkenColor(boxColor.value, 20) // Затемняем на 20%
})

interface CollectedGift {
  id: number
  style: {
    left: string
    top: string
    transform: string
    zIndex: number
  }
  appearing: boolean
  discount: number // Скидка этого подарка
  imageUrl?: string // URL изображения подарка
}

const collectedGifts = ref<CollectedGift[]>([])
let giftIdCounter = 0

// Переменные для анимации скидки
const showingDiscount = ref(false)
const currentDiscount = ref(0)


// Эмит события об обновлении агрегированных скидок
const emit = defineEmits<{
  (e: 'discount-update', payload: { sum: number; max: number }): void
}>()

const sumDiscount = computed(() => {
  return collectedGifts.value.reduce((acc, gift) => acc + (gift.discount || 0), 0)
})

const maxDiscount = computed(() => {
  if (collectedGifts.value.length === 0) return 0
  return collectedGifts.value.reduce((max, gift) => Math.max(max, gift.discount || 0), 0)
})

const notifyDiscounts = () => {
  emit('discount-update', { sum: sumDiscount.value, max: maxDiscount.value })
}

// Функция для добавления нового подарка в коробку
const addGiftToBox = (discount: number = 3, imageUrl?: string) => {
  const totalGifts = collectedGifts.value.length
  
  // Единый алгоритм зацикливания
  const positions = [
    { left: 30 },   // Центр
    { left: 1 },  // Левый верх
    { left: 15 },  
    { left: 55 },  // Правый низ 
    { left: 70 },  // Правый верх
    { left: 40 },   // Левый низ
  ]
  
  const position = positions[totalGifts % positions.length] || positions[0]
  const left = position?.left || 30
  const top = 5 + Math.random() * 20 // Случайный top
  
  const rotation = (Math.random() - 0.5) * 90 // -45 до +45 градусов
  const zIndex = collectedGifts.value.length + 1
  
  console.log(`Подарок ${totalGifts + 1} на позиции:`, left, top)
  const newGift: CollectedGift = {
      id: giftIdCounter++,
      style: {
        left: `${left}%`,
        top: `${top}%`,
        transform: `rotate(${rotation}deg)`,
        zIndex: zIndex
      },
      appearing: false,
      discount: discount,
      imageUrl: imageUrl
    }
    
    collectedGifts.value.push(newGift)
    
    // Запускаем анимацию скидки
    showDiscountAnimation(discount)

    // Сообщаем об обновлении агрегированных значений скидок
    notifyDiscounts()
}

// Функция для показа анимации скидки
const showDiscountAnimation = (discount: number) => {
  currentDiscount.value = discount
  showingDiscount.value = true
  
  // Скрываем элемент после завершения анимации (1 секунда)
  setTimeout(() => {
    showingDiscount.value = false
  }, 1000)
}

// Функция для очистки всех подарков
const clearGifts = () => {
  collectedGifts.value = []
  giftIdCounter = 0
  notifyDiscounts()
}

// Экспортируем функции для внешнего использования
defineExpose({
  addGiftToBox,
  clearGifts
})
</script>

<style scoped lang="scss">
.box {
  width: 100%;
  position: relative;

  &__gifts {
    width: 80%;
    height: 60%;
    position: absolute;
    top: -30%;
    left: 10%;
    z-index: 10;
    overflow: hidden;
  }

  &__gifts-container {
    width: 100%;
    height: 100%;
    position: relative;
  }

  &__gift {
    width: 40%;
    position: absolute;
    transition: all 0.3s ease-out;
  }


  &__discount-animation {
    position: absolute;
    top: -60px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 24px;
    font-weight: bold;
    color: #FF6B6B;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    z-index: 1001;
    pointer-events: none;
    animation: discountPopup 1s ease-out forwards;
  }
}

// Анимации для TransitionGroup
.gift-enter-active {
  transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.gift-enter-from {
  opacity: 0;
  transform: scale(0.3) rotate(-180deg);
}

.gift-enter-to {
  opacity: 1;
  transform: scale(1) rotate(0deg);
}

.gift-leave-active {
  transition: all 0.3s ease-in;
}

.gift-leave-from {
  opacity: 1;
  transform: scale(1);
}

.gift-leave-to {
  opacity: 0;
  transform: scale(0.3);
}

// Анимации для скидки

@keyframes discountPopup {
  0% {
    opacity: 1;
    transform: translateX(-50%) translateY(0%) scale(1) rotate(-30deg);
  }
  100% {
    opacity: 0;
    transform: translateX(-50%) translateY(-200%) scale(0.7) rotate(55deg);
    visibility: hidden;
  }
}

</style>