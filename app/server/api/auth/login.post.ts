import { prisma } from '~/server/lib/prisma'
import { comparePassword, generateToken } from '~/server/lib/auth'
import { createValidationError, createAuthError } from '~/server/utils/errors'
import { isValidEmail } from '~/server/utils/validation'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password } = body

  // Валидация данных
  if (!email || !isValidEmail(email)) {
    throw createValidationError('Введите корректный email')
  }

  if (!password) {
    throw createValidationError('Введите пароль')
  }

  // Поиск пользователя
  const user = await prisma.user.findUnique({
    where: { email }
  })

  if (!user) {
    throw createAuthError('Неверный email или пароль')
  }

  // Проверка пароля
  const isPasswordValid = await comparePassword(password, user.password)

  if (!isPasswordValid) {
    throw createAuthError('Неверный email или пароль')
  }

  // Генерация токена
  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role
  })

  // Установка cookie с токеном
  setCookie(event, 'auth-token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7 // 7 дней
  })

  // Возврат данных пользователя (без пароля)
  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      companyName: user.companyName,
      role: user.role,
      createdAt: user.createdAt
    }
  }
})

