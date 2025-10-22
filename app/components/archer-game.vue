<template>
  <div
    ref="wrapperRef"
    class="archer-game__wrapper"
    @mousedown="handleWrapperMouseDown"
    @touchstart="handleWrapperTouchStart"
  >
    <div class="game-field__inner">
      <!-- Индикатор выстрелов в левом верхнем углу -->
      <div class="archer-game__shots">
        <div class="shots__inner">
          <div v-for="n in remainingShots" :key="n" class="shots__arrow">
            <ArcherManArrow />
          </div>
        </div>
      </div>

      <div class="archer-game__man">
        <ArcherMan ref="archerManRef" :on-collision-check="handleCollisionCheck" :on-shot-end="handleShotEnd" />
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
        <ArcherImagesBox ref="boxRef" @discount-update="handleDiscountUpdate" />
      </div>

      <div class="archer-game__prizes">
        <ArcherPrizes ref="prizesRef" />
      </div>
      <!-- Индикатор скидки в правом нижнем углу -->
      <div class="archer-game__discount">
        <div class="discount__inner">
          <span class="discount__label">{{ discountLabel }}</span>
          <span class="discount__value">{{ discountValue }}%</span>
        </div>
      </div>
    </div>
    <!-- Модальное окно окончания игры -->
    <ModalOverlay v-if="showEndModal" :collected-gifts="collectedGifts" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, provide, onMounted, onUnmounted } from 'vue';
import { useSettingsStore } from '~/stores/settings';
import { storeToRefs } from 'pinia';
import ModalOverlay from '~/components/ModalOverlay.vue';
import ArcherManArrow from '~/components/archer/man/arrow.vue';

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

// Счётчик оставшихся выстрелов
const remainingShots = ref<number>(gameSettings.value.shotsCount || 3);
const showEndModal = ref(false);

// Агрегированные скидки
const totalDiscountSum = ref(0)
const totalDiscountMax = ref(0)

// Собранные подарки для передачи в модальное окно
const collectedGifts = ref<Array<{ discount: number; imageUrl?: string; name?: string }>>([])

const handleDiscountUpdate = (payload: { sum: number; max: number; gifts?: Array<{ discount: number; imageUrl?: string; name?: string }> }) => {
  totalDiscountSum.value = payload.sum || 0
  totalDiscountMax.value = payload.max || 0
  if (payload.gifts) {
    collectedGifts.value = payload.gifts
    console.log(collectedGifts.value)
  }
}

const discountLabel = computed(() => 'Ваша скидка')
const discountValue = computed(() => gameSettings.value.discountMode === 'sum' ? totalDiscountSum.value : totalDiscountMax.value)

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
  if (remainingShots.value <= 0) return;
  if (archerManRef.value && archerManRef.value.shoot) {
    archerManRef.value.shoot(position);
    // Убираем одну стрелу сразу при выстреле
    remainingShots.value = Math.max(0, remainingShots.value - 1);
    // Резервный показ модалки, если onShotEnd не сработает по какой-то причине
    if (remainingShots.value === 0) {
      setTimeout(() => {
        if (!showEndModal.value) {
          showEndModal.value = true;
        }
      }, 3000);
    }
  }
};

// Обработчик клика на wrapper для начала драга
const handleWrapperMouseDown = (e: MouseEvent) => {
  // Не обрабатываем события, если модальное окно открыто
  if (showEndModal.value) {
    return;
  }
  
  if (aimControlRef.value && aimControlRef.value.startDragFromAnywhere) {
    aimControlRef.value.startDragFromAnywhere(e);
  }
};

const handleWrapperTouchStart = (e: TouchEvent) => {
  // Не обрабатываем события, если модальное окно открыто
  if (showEndModal.value) {
    return;
  }
  
  if (aimControlRef.value && aimControlRef.value.startDragFromAnywhere) {
    aimControlRef.value.startDragFromAnywhere(e);
  }
};

// Сообщение об окончании выстрела из ArcherMan
const handleShotEnd = () => {
  // Если выстрелов не осталось, показываем модалку с небольшой задержкой
  if (remainingShots.value === 0) {
    // Небольшая задержка, чтобы завершились анимации подарка/корзины
    setTimeout(() => {
      showEndModal.value = true;
    }, 1500);
  }
};

// Обработчик попадания в подарок - перемещаем корзину
const handlePrizeHit = (leftPosition: number, isBad: boolean = false, discount: number = 3, imageUrl?: string, prizeIndex?: number) => {
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
        boxRef.value.addGiftToBox(discount, imageUrl, prizeIndex)
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
  // Сбрасываем счётчик выстрелов и скрываем модалку
  remainingShots.value = gameSettings.value.shotsCount || 3;
  showEndModal.value = false;
  // Сбрасываем агрегированные скидки
  totalDiscountSum.value = 0
  totalDiscountMax.value = 0
  // Очищаем собранные подарки
  collectedGifts.value = []
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
    container-type: inline-size; /* Включаем Container Queries */

    .game-field__inner {
      font-size: 14px; /* Базовый размер для rem */
    }

    .modal-overlay {
      font-size: 14px;
    }

    @container (max-width: 600px) {
      .game-field__inner {
        font-size: 10px;
      }

      .modal-overlay {
        font-size: 10px;
      }
    }
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
    width: 8%;
    position: absolute;
    bottom: 24%;
    left: 39%;
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

  &__shots {
    position: absolute;
    z-index: 1200;
    top: 6%;
    left: 2%;

    .shots__inner {
      display: flex;
      align-items: center;
    }
    .shots__arrow {
      width: 3rem; // относительный размер от ширины игрового поля
      transform: rotate(-25deg);
      margin-right: -3%;
    }
  }

  &__discount {
    position: absolute;
    right: 3%;
    bottom: 3%;
    z-index: 1200;
    font-size: inherit; /* Наследует размер от wrapper */

    .discount__inner {
      display: flex;
      align-items: baseline;
      gap: 0.5rem;
      color: #fff;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.6);
      font-weight: 700;
      user-select: none;
    }

    .discount__label {
      font-size: 100%; /* Используем em вместо rem для масштабирования относительно контейнера */
      opacity: 0.95;
      text-transform: uppercase;
    }

    .discount__value {
      font-size: 1.6em; /* Используем em вместо rem для масштабирования относительно контейнера */
    }
  }
}
</style>