<template>
  <div class="prizes">
    <div class="prizes__inner">
      <div class="prizes__gift">
        <ArcherImagesGift />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
.prizes {
  width: 100%;
  padding-bottom: 50%;
  position: relative;
  overflow: hidden;

  &__inner {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  &__gift {
    width: 10%;
    position: absolute;
    top: 10%;
    left: 15%;
    z-index: 100;
  }
}
</style>