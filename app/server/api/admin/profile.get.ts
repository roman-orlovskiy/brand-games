import { prisma } from '~/server/lib/prisma'
import { getUserFromEvent } from '~/server/lib/auth'
import { createAuthError } from '~/server/utils/errors'

export default defineEventHandler(async (event) => {
  const payload = getUserFromEvent(event)

  if (!payload) {
    throw createAuthError()
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
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

  if (!user) {
    throw createAuthError('Пользователь не найден')
  }

  return {
    user
  }
})

