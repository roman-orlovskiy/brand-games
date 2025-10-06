<template>
  <div class="game-field__wrapper">
    <div class="game-field__inner">

      <div class="game-field__tree">
        <ImagesTreeImage />
      </div>

      <div class="game-field__land">
        <ImagesLandImage />
      </div>
    </div>
  </div>
</template>

<script lang="ts">

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
    width: 70%;
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
}
</style>