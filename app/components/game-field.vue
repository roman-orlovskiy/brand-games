<template>
  <div class="game-field__wrapper">
    <div class="game-field__inner"></div>
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
    background-color: red;
  }
  
  &__inner {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}
</style>