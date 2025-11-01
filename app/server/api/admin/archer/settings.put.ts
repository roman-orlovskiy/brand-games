import { prisma } from '~/server/lib/prisma'
import { getUserFromEvent } from '~/server/lib/auth'
import { createAuthError, createValidationError } from '~/server/utils/errors'

export default defineEventHandler(async (event) => {
  const payload = getUserFromEvent(event)

  if (!payload) {
    throw createAuthError()
  }

  const body = await readBody(event)
  const { colors, prizesCount, badPrizesCount, logoUrl, prizes, discountMode, shotsCount, formSettings } = body

  // Валидация данных
  if (colors && !Array.isArray(colors)) {
    throw createValidationError('Цвета должны быть массивом')
  }

  if (prizesCount !== undefined && (prizesCount < 1 || prizesCount > 10)) {
    throw createValidationError('Количество подарков должно быть от 1 до 10')
  }

  if (badPrizesCount !== undefined && (badPrizesCount < 0 || badPrizesCount > 5)) {
    throw createValidationError('Количество плохих призов должно быть от 0 до 5')
  }

  if (shotsCount !== undefined && (shotsCount < 1 || shotsCount > 10)) {
    throw createValidationError('Количество выстрелов должно быть от 1 до 10')
  }

  if (discountMode && discountMode !== 'sum' && discountMode !== 'max') {
    throw createValidationError('Режим скидок должен быть "sum" или "max"')
  }

  if (prizes && !Array.isArray(prizes)) {
    throw createValidationError('Подарки должны быть массивом')
  }

  // Подготовка данных для обновления
  const updateData: any = {}
  
  if (colors !== undefined) updateData.colors = colors
  if (prizesCount !== undefined) updateData.prizesCount = prizesCount
  if (badPrizesCount !== undefined) updateData.badPrizesCount = badPrizesCount
  if (logoUrl !== undefined) updateData.logoUrl = logoUrl
  if (prizes !== undefined) updateData.prizes = prizes
  if (discountMode !== undefined) updateData.discountMode = discountMode
  if (shotsCount !== undefined) updateData.shotsCount = shotsCount
  if (formSettings !== undefined) updateData.formSettings = formSettings

  // Получение или создание настроек игры
  let gameSettings = await prisma.gameSettings.findUnique({
    where: { userId: payload.userId }
  })

  if (gameSettings) {
    // Обновление существующих настроек
    gameSettings = await prisma.gameSettings.update({
      where: { userId: payload.userId },
      data: updateData
    })
  } else {
    // Создание новых настроек с дефолтными значениями
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

    gameSettings = await prisma.gameSettings.create({
      data: {
        userId: payload.userId,
        colors: updateData.colors || defaultColors,
        prizesCount: updateData.prizesCount || 4,
        badPrizesCount: updateData.badPrizesCount || 3,
        logoUrl: updateData.logoUrl || null,
        prizes: updateData.prizes || defaultPrizes,
        discountMode: updateData.discountMode || 'max',
        shotsCount: updateData.shotsCount || 3,
        formSettings: updateData.formSettings || defaultFormSettings
      }
    })
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

