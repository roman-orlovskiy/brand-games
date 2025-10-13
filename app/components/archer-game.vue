<template>
  <div class="archer-game__wrapper">
    <div class="game-field__inner">

      <div class="archer-game__man">
        <ArcherMan ref="archerManRef" />
      </div>

      <!-- Управление прицелом -->
      <ArcherAimControl @aim-change="handleAimChange" />

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
        <ArcherPrizes />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

const boxLeft = ref(40);
const archerManRef = ref();

const boxStyle = computed(() => ({
  left: `${boxLeft.value}%`,
}));

// Обработчик изменения прицела
const handleAimChange = (position: { x: number, y: number, power: number }) => {
  if (archerManRef.value && archerManRef.value.handleAimChange) {
    archerManRef.value.handleAimChange(position);
  }
};
</script>

<style scoped lang="scss">
.archer-game {
  &__wrapper {
    width: 100%;
    position: relative;
    /* Пропорции 1453:1000 = 1000/1453 ≈ 0.688 */
    padding-top: 68.8%; /* 1000/1453 * 100% */
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
  }
}
</style>