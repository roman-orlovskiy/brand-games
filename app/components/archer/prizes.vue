<template>
  <div class="prizes">
    <div class="prizes__inner">
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
  background-color: rgba(255, 0, 0, 0.5);

  &__inner {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}
</style>