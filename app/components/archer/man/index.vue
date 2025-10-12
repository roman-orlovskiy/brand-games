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
    height: 35%;
    left: 20%;
    top: 10%;
    z-index: 2;
  }

  // Ноги (legs): скорректированные размеры и позиция
  &__legs {
    position: absolute;
    width: 40%;
    height: 30%;
    left: 10%;
    top: 65%;
    z-index: 1;
  }

  // Лук (bow): пока скрыт, так как нет компонента лука
  &__bow {
    display: none;
  }

  // Стрела (arrow): скорректированные размеры и позиция
  &__arrow {
    position: absolute;
    width: 30%;
    height: auto;
    left: 50%;
    top: 25%;
    z-index: 4;
  }

  // Левая рука (hand): скорректированные размеры и позиция
  &__hand {
    position: absolute;
    width: 15%;
    height: 20%;
    left: 0%;
    top: 5%;
    z-index: 3;
  }

  // Правая рука (hand2): скорректированные размеры и позиция
  &__hand2 {
    position: absolute;
    width: 15%;
    height: 20%;
    left: 55%;
    top: 25%;
    z-index: 5;
  }

  // Стрелы в колчане (arrows): скорректированные размеры и позиция
  &__arrows {
    position: absolute;
    width: 15%;
    height: 20%;
    left: 0%;
    top: 5%;
    z-index: 3;
  }
}
</style>  