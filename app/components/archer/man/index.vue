<template>
  <div class="archer-man">
    
    <div class="archer-man__content">
      <div class="archer-man__body">
        <ArcherManBody />
      </div>
      <div class="archer-man__legs">
        <ArcherManLegs />
      </div>
      <div class="archer-man__arrow">
        <ArcherManArrow />
      </div>
      <div class="archer-man__hand">
        <ArcherManHand />
      </div>
      <div class="archer-man__hand2">
        <ArcherManHand2 />
      </div>
      <div class="archer-man__arrows">
        <ArcherManArrows />
      </div>
    </div>
  </div>
  </template>

<script setup lang="ts">
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

  // Стрела (arrow): скорректированные размеры и позиция
  &__arrow {
    position: absolute;
    width: 50%;
    left: 20%;
    top: 35%;
    z-index: 15;
  }

  // Левая рука (hand): скорректированные размеры и позиция
  &__hand {
    position: absolute;
    width: 26%;
    left: 2%;
    top: 49%;
    z-index: 15;
  }

  // Правая рука (hand2): скорректированные размеры и позиция
  &__hand2 {
    position: absolute;
    width: 60%;
    left: 14%;
    top: 23%;
    z-index: 5;
  }

  // Стрелы в колчане (arrows): скорректированные размеры и позиция
  &__arrows {
    position: absolute;
    width: 18%;
    left: 3%;
    top: 32%;
    z-index: 1;
  }
}
</style>  