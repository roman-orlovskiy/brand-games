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
        class="archer-game__box"
        :style="boxStyle"
      >
        <ArcherImagesBox />
      </div>

      <div class="archer-game__prizes">
        <ArcherPrizes ref="prizesRef" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, provide, onMounted, onUnmounted } from 'vue';

const boxLeft = ref(40);
const archerManRef = ref();
const aimControlRef = ref();
const prizesRef = ref();
const wrapperRef = ref<HTMLDivElement>();

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
const handlePrizeHit = (leftPosition: number) => {
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
}

// Обработчик проверки коллизий
const handleCollisionCheck = (x: number, y: number): boolean => {
  if (prizesRef.value && prizesRef.value.checkCollision) {
    return prizesRef.value.checkCollision(x, y, handlePrizeHit);
  }
  return false;
};
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

  &__box {
    width: 14%; // Уменьшено в два раза (23% / 2)
    position: absolute;
    bottom: 10%;
    z-index: 50;
    transition: left 1s ease-out;
  }
}
</style>