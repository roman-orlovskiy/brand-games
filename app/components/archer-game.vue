<template>
  <div
    ref="wrapperRef"
    class="archer-game__wrapper"
    @mousedown="handleWrapperMouseDown"
    @touchstart="handleWrapperTouchStart"
  >
    <div class="game-field__inner">

      <div class="archer-game__man">
        <ArcherMan ref="archerManRef" :on-collision-check="handleCollisionCheck" />
      </div>

      <!-- Управление прицелом -->
      <ArcherAimControl ref="aimControlRef" @aim-change="handleAimChange" @shoot="handleShoot" />

      <div class="archer-game__tree">
        <ArcherImagesTree />
      </div>

      <div class="archer-game__land">
        <ArcherImagesLand />
      </div>

      <div class="archer-game__back">
        <ArcherImagesBack />
      </div>

      <div
        v-if="logoUrl"
        class="archer-game__back-logo"
      >
        <img
          :src="logoUrl"
          alt="Логотип"
          class="max-h-full max-w-full object-contain"
        >
      </div>

      <div
        class="archer-game__box"
        :style="boxStyle"
      >
        <ArcherImagesBox ref="boxRef" />
      </div>

      <div class="archer-game__prizes">
        <ArcherPrizes ref="prizesRef" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, provide, onMounted, onUnmounted } from 'vue';
import { useSettingsStore } from '~/stores/settings';
import { storeToRefs } from 'pinia';

const boxLeft = ref(40);
const archerManRef = ref();
const aimControlRef = ref();
const prizesRef = ref();
const boxRef = ref();
const wrapperRef = ref<HTMLDivElement>();

// Настройки игры
const settingsStore = useSettingsStore();
const { gameSettings } = storeToRefs(settingsStore);

const logoUrl = computed(() => gameSettings.value.logoUrl);

// Размеры контейнера для расчетов траектории
const containerSize = ref({ width: 0, height: 0 });

// Вычисляем scale на основе размера контейнера (800px = scale 1)
const gameScale = computed(() => {
  return containerSize.value.width / 800;
});

// Предоставляем размеры контейнера и scale всем дочерним компонентам
provide('gameContainerSize', containerSize);
provide('gameScale', gameScale);

// ResizeObserver для отслеживания изменений размера
let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
  if (wrapperRef.value) {
    // Начальные размеры
    updateContainerSize();
    
    // Отслеживаем изменения размера
    resizeObserver = new ResizeObserver(() => {
      updateContainerSize();
    });
    resizeObserver.observe(wrapperRef.value);
  }
});

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
});

const updateContainerSize = () => {
  if (wrapperRef.value) {
    const rect = wrapperRef.value.getBoundingClientRect();
    containerSize.value = {
      width: rect.width,
      height: rect.height
    };
  }
};

const boxStyle = computed(() => ({
  left: `${boxLeft.value}%`,
}));

// Обработчик изменения прицела
const handleAimChange = (position: { x: number, y: number, power: number }) => {
  if (archerManRef.value && archerManRef.value.handleAimChange) {
    archerManRef.value.handleAimChange(position);
  }
};

// Обработчик выстрела
const handleShoot = (position: { x: number, y: number, power: number }) => {
  if (archerManRef.value && archerManRef.value.shoot) {
    archerManRef.value.shoot(position);
  }
};

// Обработчик клика на wrapper для начала драга
const handleWrapperMouseDown = (e: MouseEvent) => {
  if (aimControlRef.value && aimControlRef.value.startDragFromAnywhere) {
    aimControlRef.value.startDragFromAnywhere(e);
  }
};

const handleWrapperTouchStart = (e: TouchEvent) => {
  if (aimControlRef.value && aimControlRef.value.startDragFromAnywhere) {
    aimControlRef.value.startDragFromAnywhere(e);
  }
};

// Обработчик попадания в подарок - перемещаем корзину
const handlePrizeHit = (leftPosition: number, isBad: boolean = false, discount: number = 3) => {
  // Корзина подъезжает только к хорошим призам
  if (!isBad) {
    // Конвертируем позицию подарка в позицию корзины
    // Подарки находятся в контейнере шириной 70%, начиная с 30% справа
    // leftPosition - позиция подарка внутри контейнера призов (в процентах)
    
    // Левый край подарка относительно игрового поля
    const prizeLeft = 30 + (leftPosition * 0.7)
    
    // Подарок занимает 10% от контейнера призов = 7% от игрового поля
    // Центр подарка: левый край + половина ширины
    const prizeCenter = prizeLeft + 3.5
    
    // Корзина имеет ширину 14%, центрируем её под подарком
    const boxTargetPosition = prizeCenter - 7
    
    // Плавно перемещаем корзину
    boxLeft.value = boxTargetPosition
    
    // Добавляем подарок в коробку с небольшой задержкой
    setTimeout(() => {
      if (boxRef.value && boxRef.value.addGiftToBox) {
        boxRef.value.addGiftToBox(discount)
      }
    }, 1200) // Задержка, чтобы подарок успел упасть в корзину
    
    console.log(`Попал в хороший приз со скидкой ${discount}%! Корзина подъехала и добавила подарок.`)
  } else {
    console.log('Попал в плохой приз (мусор)! Корзина остается на месте.')
    // TODO: Добавить логику для плохих призов (например, штрафные очки)
  }
}

// Обработчик проверки коллизий
const handleCollisionCheck = (x: number, y: number): boolean => {
  if (prizesRef.value && prizesRef.value.checkCollision) {
    return prizesRef.value.checkCollision(x, y, handlePrizeHit);
  }
  return false;
};

// Функция для сброса игры
const resetGame = () => {
  // Сбрасываем призы
  if (prizesRef.value && prizesRef.value.resetPrizes) {
    prizesRef.value.resetPrizes();
  }
  
  // Очищаем подарки в коробке
  if (boxRef.value && boxRef.value.clearGifts) {
    boxRef.value.clearGifts();
  }
  
  // Сбрасываем позицию коробки
  boxLeft.value = 40;
};

// Экспортируем функцию сброса для внешнего использования
defineExpose({
  resetGame
});
</script>

<style scoped lang="scss">
.archer-game {
  &__wrapper {
    width: 100%;
    position: relative;
    /* Пропорции 1453:1000 = 1000/1453 ≈ 0.688 */
    padding-top: 68.8%; /* 1000/1453 * 100% */
    overflow: hidden;
  }

  &__man {
    width: 22%;
    position: absolute;
    bottom: 8%;
    left: 6%;
    z-index: 100;
  }
  
  &__inner {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  &__tree {
    width: 72%;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 50;
  }

  &__prizes {
    width: 70%;
    position: absolute;
    top: 0;
    right: 0;
    z-index: 80;
  }

  &__land {
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 40;
  }

  &__back {
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 30;
  }

  &__back-logo {
    width: 12%;
    position: absolute;
    bottom: 24%;
    left: 37%;
    z-index: 35;

    img {
      width: 100%;
    }
  }

  &__box {
    width: 14%; // Уменьшено в два раза (23% / 2)
    position: absolute;
    bottom: 10%;
    z-index: 90;
    transition: left 1s ease-out;
  }
}
</style>