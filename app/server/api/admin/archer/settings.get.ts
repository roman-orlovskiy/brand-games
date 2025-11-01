import { prisma } from '~/server/lib/prisma'
import { getUserFromEvent } from '~/server/lib/auth'
import { createAuthError } from '~/server/utils/errors'

export default defineEventHandler(async (event) => {
  const payload = getUserFromEvent(event)

  if (!payload) {
    throw createAuthError()
  }

  // Получение настроек игры или создание дефолтных
  let gameSettings = await prisma.gameSettings.findUnique({
    where: { userId: payload.userId }
  })

  // Если настроек нет, возвращаем дефолтные
  if (!gameSettings) {
    const defaultColors = [
      { id: 'tree', name: 'Дерево', brandColorId: 'main', color: '#00BCD4' },
      { id: 'crown', name: 'Крона', brandColorId: 'additional', color: '#00BFA5' },
      { id: 'trajectory', name: 'Траектория', brandColorId: 'accent', color: '#FF6B6B' },
      { id: 'archer', name: 'Майка лучника', brandColorId: 'accent', color: '#FF6B6B' },
      { id: 'bow', name: 'Лук', brandColorId: 'neutral', color: '#C27BA0' },
      { id: 'arrow', name: 'Стрела', brandColorId: 'neutral', color: '#C27BA0' },
      { id: 'background', name: 'Фон', brandColorId: 'background', color: '#FFFDE7' },
      { id: 'land', name: 'Земля', brandColorId: 'additional', color: '#00BFA5' },
      { id: 'prizes', name: 'Призы', brandColorId: 'accent', color: '#FF6B6B' },
      { id: 'box', name: 'Корзина', brandColorId: 'neutral', color: '#C27BA0' },
      { id: 'trash', name: 'Мусор', brandColorId: 'neutral', color: '#C27BA0' },
      { id: 'interface', name: 'Интерфейс', brandColorId: 'main', color: '#00BCD4' }
    ]

    const defaultPrizes = [
      { id: '1', name: 'Подарок 1', discount: 3 },
      { id: '2', name: 'Подарок 2', discount: 3 },
      { id: '3', name: 'Подарок 3', discount: 3 },
      { id: '4', name: 'Подарок 4', discount: 3 }
    ]

    const defaultFormSettings = {
      submitButtonColor: '#00BCD4',
      overlayBackgroundColor: '#C27BA0',
      titleText: 'Итоги игры',
      descriptionText: 'Чтобы получить промокод заполните контактные данные',
      buttonText: 'Получить промокод',
      discountDescription: 'Ваша скидка<br>Промокод действует до конца месяца',
      defaultPromoCode: 'BRAND2025'
    }

    return {
      gameSettings: {
        colors: defaultColors,
        prizesCount: 4,
        badPrizesCount: 3,
        logoUrl: null,
        prizes: defaultPrizes,
        discountMode: 'max',
        shotsCount: 3,
        formSettings: defaultFormSettings
      }
    }
  }

  return {
    gameSettings: {
      colors: gameSettings.colors as any,
      prizesCount: gameSettings.prizesCount,
      badPrizesCount: gameSettings.badPrizesCount,
      logoUrl: gameSettings.logoUrl,
      prizes: gameSettings.prizes as any,
      discountMode: gameSettings.discountMode,
      shotsCount: gameSettings.shotsCount,
      formSettings: gameSettings.formSettings as any
    }
  }
})

