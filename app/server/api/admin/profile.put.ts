import { prisma } from '~/server/lib/prisma'
import { getUserFromEvent } from '~/server/lib/auth'
import { createAuthError, createValidationError } from '~/server/utils/errors'
import { isValidName } from '~/server/utils/validation'

export default defineEventHandler(async (event) => {
  const payload = getUserFromEvent(event)

  if (!payload) {
    throw createAuthError()
  }

  const body = await readBody(event)
  const { name, companyName } = body

  // Валидация данных
  if (name !== undefined && !isValidName(name)) {
    throw createValidationError('Имя должно содержать минимум 2 символа')
  }

  // Обновление профиля
  const user = await prisma.user.update({
    where: { id: payload.userId },
    data: {
      ...(name !== undefined && { name }),
      ...(companyName !== undefined && { companyName: companyName || null })
    },
    select: {
      id: true,
      email: true,
      name: true,
      companyName: true,
      role: true,
      createdAt: true,
      updatedAt: true
    }
  })

  return {
    user
  }
})

