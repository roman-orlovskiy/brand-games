import { prisma } from '~/server/lib/prisma'
import { createValidationError, createServerError } from '~/server/utils/errors'
import { isValidEmail, isValidPhone, isValidName } from '~/server/utils/validation'
import { getUserFromEvent } from '~/server/lib/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { firstName, lastName, phone, email, mode, promoCode } = body

  // Валидация данных
  if (!firstName || !isValidName(firstName)) {
    throw createValidationError('Имя должно содержать минимум 2 символа')
  }

  if (!lastName || !isValidName(lastName)) {
    throw createValidationError('Фамилия должна содержать минимум 2 символа')
  }

  if (!phone || !isValidPhone(phone)) {
    throw createValidationError('Введите корректный номер телефона')
  }

  if (!email || !isValidEmail(email)) {
    throw createValidationError('Введите корректный email')
  }

  if (!mode || (mode !== 'sum' && mode !== 'max')) {
    throw createValidationError('Режим игры должен быть "sum" или "max"')
  }

  // Получение userId из токена (если есть)
  const payload = getUserFromEvent(event)
  const userId = payload?.userId || null

  // Сохранение результата игры
  try {
    const gameResult = await prisma.gameResult.create({
      data: {
        userId,
        firstName,
        lastName,
        phone,
        email,
        mode,
        promoCode: promoCode || null,
        playedAt: new Date()
      }
    })

    return {
      success: true,
      result: gameResult
    }
  } catch (error) {
    throw createServerError('Ошибка при сохранении результата игры')
  }
})

