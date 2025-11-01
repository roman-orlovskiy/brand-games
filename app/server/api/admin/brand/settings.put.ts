import { prisma } from '~/server/lib/prisma'
import { getUserFromEvent } from '~/server/lib/auth'
import { createAuthError, createValidationError } from '~/server/utils/errors'

export default defineEventHandler(async (event) => {
  const payload = getUserFromEvent(event)

  if (!payload) {
    throw createAuthError()
  }

  const body = await readBody(event)
  const { colors } = body

  // Валидация данных
  if (!colors || !Array.isArray(colors)) {
    throw createValidationError('Цвета должны быть массивом')
  }

  // Проверка структуры цветов
  for (const color of colors) {
    if (!color.id || !color.name || !color.color) {
      throw createValidationError('Каждый цвет должен содержать id, name и color')
    }
  }

  // Получение или создание настроек бренда
  let brandSettings = await prisma.brandSettings.findUnique({
    where: { userId: payload.userId }
  })

  if (brandSettings) {
    // Обновление существующих настроек
    brandSettings = await prisma.brandSettings.update({
      where: { userId: payload.userId },
      data: {
        colors: colors as any
      }
    })
  } else {
    // Создание новых настроек
    brandSettings = await prisma.brandSettings.create({
      data: {
        userId: payload.userId,
        colors: colors as any
      }
    })
  }

  return {
    brandSettings: {
      colors: brandSettings.colors as any
    }
  }
})

