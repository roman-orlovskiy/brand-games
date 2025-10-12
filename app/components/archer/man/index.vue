<template>
  <div class="archer-man">
    
    <div class="archer-man__content">
      <div class="archer-man__body">
        <ArcherManBody />
      </div>
      <div class="archer-man__legs">
        <ArcherManLegs />
      </div>
      <div class="archer-man__hand">
        <ArcherManHand />
      </div>
      <div class="archer-man__arrow">
        <ArcherManArrow />
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
import ArcherManBody from './body.vue';
import ArcherManLegs from './legs.vue';
import ArcherManHand from './hand.vue';
import ArcherManArrow from './arrow.vue';
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
}
</style>  