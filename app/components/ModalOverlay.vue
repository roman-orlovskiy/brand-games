<template>
  <div class="modal-overlay">
    <div class="modal-overlay__backdrop" />
    <div class="modal-overlay__content">
      <div class="placeholder">Итоги игры</div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
.modal-overlay {
  position: absolute;
  inset: 0;
  z-index: 5000;

  &__backdrop {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
  }

  &__content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 60%;
    max-width: 40rem;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 12px;
    padding: 2rem;
    text-align: center;
  }
}

.placeholder {
  color: #111;
  font-size: 1.25rem;
  font-weight: 600;
}
</style>


