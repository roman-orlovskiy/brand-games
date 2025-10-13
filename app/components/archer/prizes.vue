<template>
  <div class="prizes">
    <div class="prizes__inner">
      <div 
        v-for="(prize, index) in prizes" 
        :key="index" 
        class="prizes__gift"
        :style="prize.style"
      >
        <ArcherImagesGift />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useSettingsStore } from '~/stores/settings'

const settingsStore = useSettingsStore()

interface Prize {
  style: {
    top: string
    left: string
  }
}

// Генерируем рандомные позиции для подарков
const prizes = computed(() => {
  const count = settingsStore.gameSettings.prizesCount
  const result: Prize[] = []
  
  for (let i = 0; i < count; i++) {
    // Генерируем позиции в верхней части (10-40% по высоте)
    // И распределяем по ширине (10-90%)
    result.push({
      style: {
        top: `${10 + Math.random() * 30}%`,
        left: `${10 + Math.random() * 80}%`
      }
    })
  }
  
  return result
})
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
    z-index: 100;
  }
}
</style>