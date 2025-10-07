<template>
  <div class="game-field__wrapper">
    <div class="game-field__inner">

      <div class="game-field__tree">
        <ImagesArcherTree />
      </div>

      <div class="game-field__land">
        <ImagesArcherLand />
      </div>

      <div class="game-field__back">
        <ImagesArcherBack />
      </div>

      <div
        class="game-field__box"
        :style="boxStyle"
      >
        <ImagesArcherBox />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
const boxLeft = ref(40);

const boxStyle = computed(() => ({
  left: `${boxLeft.value}%`,
}));
</script>

<style scoped lang="scss">
.game-field {
  &__wrapper {
    width: 100%;
    position: relative;
    /* Пропорции 1453:1000 = 1000/1453 ≈ 0.688 */
    padding-top: 68.8%; /* 1000/1453 * 100% */
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
    width: 23%;
    position: absolute;
    bottom: 10%;
    z-index: 50;
  }
}
</style>