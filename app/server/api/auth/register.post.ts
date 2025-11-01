import { prisma } from '~/server/lib/prisma'
import { hashPassword } from '~/server/lib/auth'
import { createValidationError, createServerError } from '~/server/utils/errors'
import { isValidEmail, isValidPassword, isValidName } from '~/server/utils/validation'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password, name, companyName } = body

  // Валидация данных
  if (!email || !isValidEmail(email)) {
    throw createValidationError('Введите корректный email')
  }

  if (!password || !isValidPassword(password)) {
    throw createValidationError('Пароль должен содержать минимум 6 символов')
  }

  if (!name || !isValidName(name)) {
    throw createValidationError('Имя должно содержать минимум 2 символа')
  }

  // Проверка существования пользователя
  const existingUser = await prisma.user.findUnique({
    where: { email }
  })

  if (existingUser) {
    throw createValidationError('Пользователь с таким email уже существует')
  }

  // Хеширование пароля
  const hashedPassword = await hashPassword(password)

  // Создание пользователя
  try {
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        companyName: companyName || null,
        role: 'user'
      },
      select: {
        id: true,
        email: true,
        name: true,
        companyName: true,
        role: true,
        createdAt: true
      }
    })

    return {
      user
    }
  } catch (error) {
    throw createServerError('Ошибка при создании пользователя')
  }
})

