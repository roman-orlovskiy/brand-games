import { prisma } from '~/server/lib/prisma'
import { getUserFromEvent } from '~/server/lib/auth'
import { comparePassword, hashPassword } from '~/server/lib/auth'
import { createAuthError, createValidationError } from '~/server/utils/errors'
import { isValidPassword } from '~/server/utils/validation'

export default defineEventHandler(async (event) => {
  const payload = getUserFromEvent(event)

  if (!payload) {
    throw createAuthError()
  }

  const body = await readBody(event)
  const { oldPassword, newPassword } = body

  // Валидация данных
  if (!oldPassword) {
    throw createValidationError('Введите текущий пароль')
  }

  if (!newPassword || !isValidPassword(newPassword)) {
    throw createValidationError('Новый пароль должен содержать минимум 6 символов')
  }

  // Получение пользователя из БД
  const user = await prisma.user.findUnique({
    where: { id: payload.userId }
  })

  if (!user) {
    throw createAuthError('Пользователь не найден')
  }

  // Проверка старого пароля
  const isOldPasswordValid = await comparePassword(oldPassword, user.password)

  if (!isOldPasswordValid) {
    throw createValidationError('Неверный текущий пароль')
  }

  // Хеширование нового пароля
  const hashedNewPassword = await hashPassword(newPassword)

  // Обновление пароля
  await prisma.user.update({
    where: { id: payload.userId },
    data: {
      password: hashedNewPassword
    }
  })

  return {
    success: true,
    message: 'Пароль успешно изменен'
  }
})

