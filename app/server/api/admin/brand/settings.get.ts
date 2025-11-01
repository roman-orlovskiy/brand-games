import { prisma } from '~/server/lib/prisma'
import { getUserFromEvent } from '~/server/lib/auth'
import { createAuthError } from '~/server/utils/errors'

export default defineEventHandler(async (event) => {
  const payload = getUserFromEvent(event)

  if (!payload) {
    throw createAuthError()
  }

  // Получение настроек бренда или создание дефолтных
  let brandSettings = await prisma.brandSettings.findUnique({
    where: { userId: payload.userId }
  })

  // Если настроек нет, возвращаем дефолтные
  if (!brandSettings) {
    const defaultColors = [
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

    return {
      brandSettings: {
        colors: defaultColors
      }
    }
  }

  return {
    brandSettings: {
      colors: brandSettings.colors as any
    }
  }
})

