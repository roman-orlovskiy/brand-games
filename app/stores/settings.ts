import { defineStore } from 'pinia'

export interface BrandColor {
  id: number
  name: string
  color: string
  description?: string
}

export interface BrandSettings {
  colors: BrandColor[]
}

export const useSettingsStore = defineStore('settings', () => {
  // Состояние
  const brandSettings = ref<BrandSettings>({
    colors: [
      { 
        id: 1, 
        name: 'Основной', 
        color: '#00BCD4',
        description: 'Главный цвет бренда для логотипа и ключевых элементов'
      },
      { 
        id: 2, 
        name: 'Доп', 
        color: '#00BFA5',
        description: 'Вторичный цвет для акцентов и кнопок'
      },
      { 
        id: 3, 
        name: 'Нейтральный', 
        color: '#C27BA0',
        description: 'Цвет для текста и фоновых элементов'
      },
      { 
        id: 4, 
        name: 'Фоновый', 
        color: '#FFFDE7',
        description: 'Основной фоновый цвет интерфейса'
      },
      { 
        id: 5, 
        name: 'Акцентный', 
        color: '#FF6B6B',
        description: 'Цвет для выделения важных элементов'
      }
    ]
  })

  return {
    brandSettings
  }
})
