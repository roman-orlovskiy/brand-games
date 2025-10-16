import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface BrandColor {
  id: string
  name: string
  color: string
  description?: string
}

export interface BrandSettings {
  colors: BrandColor[]
}

export interface GameColor {
  id: string
  name: string
  color: string
  brandColorId: string
}

export interface GameSettings {
  colors: GameColor[]
  prizesCount: number
  badPrizesCount: number
}

export const useSettingsStore = defineStore('settings', () => {
  // Состояние
  const brandSettings = ref<BrandSettings>({
    colors: [
      { 
        id: 'main', 
        name: 'Основной', 
        color: '#00BCD4',
        description: 'Главный цвет бренда'
      },
      { 
        id: 'additional', 
        name: 'Доп', 
        color: '#00BFA5',
        description: 'Вторичный цвет для акцентов и кнопок'
      },
      { 
        id: 'neutral', 
        name: 'Нейтральный', 
        color: '#C27BA0',
        description: 'Цвет для текста и фоновых элементов'
      },
      { 
        id: 'background', 
        name: 'Фоновый', 
        color: '#FFFDE7',
        description: 'Основной фоновый цвет интерфейса'
      },
      { 
        id: 'accent', 
        name: 'Акцентный', 
        color: '#FF6B6B',
        description: 'Цвет для выделения важных элементов'
      }
    ]
  })

  const getBrandColor = (brandColorId: string) => {
    return brandSettings.value?.colors?.find(color => color.id === brandColorId)
  }

  const defaultGameColors = [
    { id: 'tree', name: 'Дерево', brandColorId: 'main' },
    { id: 'crown', name: 'Крона', brandColorId: 'additional' },
    { id: 'trajectory', name: 'Траектория', brandColorId: 'accent' },
    { id: 'archer', name: 'Майка лучника', brandColorId: 'accent' },
    { id: 'bow', name: 'Лук', brandColorId: 'neutral' },
    { id: 'arrow', name: 'Стрела', brandColorId: 'neutral' },
    { id: 'background', name: 'Фон', brandColorId: 'background' },
    { id: 'land', name: 'Земля', brandColorId: 'additional' },
    { id: 'prizes', name: 'Призы', brandColorId: 'accent' },
    { id: 'box', name: 'Корзина', brandColorId: 'neutral' },
    { id: 'trash', name: 'Мусор', brandColorId: 'neutral' },
    { id: 'interface', name: 'Интерфейс', brandColorId: 'main' },
  ].map(color => ({
    ...color,
    color: getBrandColor(color.brandColorId)?.color || '#000000'
  }))

  const gameSettings = ref<GameSettings>({
    colors: [...defaultGameColors],
    prizesCount: 4,
    badPrizesCount: 3
  })

  // Computed свойство для быстрого доступа к цветам по ID
  const gameSettingsColorsById = computed(() => {
    return gameSettings.value.colors.reduce((acc, color) => {
      acc[color.id] = color
      return acc
    }, {} as Record<string, GameColor>)
  })

  // Действия
  const updateGameColor = (gameColorId: string, brandColorId: string) => {
    const gameColor = gameSettingsColorsById.value[gameColorId]
    const brandColor = getBrandColor(brandColorId)
    if (gameColor && brandColor) {
      gameColor.color = brandColor.color
      gameColor.brandColorId = brandColor.id
    }
  }

  const updatePrizesCount = (count: number) => {
    gameSettings.value.prizesCount = Math.max(1, Math.min(10, count)) // От 1 до 10 подарков
  }

  const updateBadPrizesCount = (count: number) => {
    gameSettings.value.badPrizesCount = Math.max(0, Math.min(5, count)) // От 0 до 5 плохих призов
  }

  return {
    brandSettings,
    gameSettings,
    gameSettingsColorsById,
    updateGameColor,
    updatePrizesCount,
    updateBadPrizesCount
  }
})
