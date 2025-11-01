import { prisma } from '~/server/lib/prisma'
import { getUserFromEvent } from '~/server/lib/auth'
import { createAuthError } from '~/server/utils/errors'

export default defineEventHandler(async (event) => {
  const payload = getUserFromEvent(event)

  if (!payload) {
    throw createAuthError()
  }

  // Получение query параметров для фильтрации
  const query = getQuery(event)
  const startDate = query.startDate ? new Date(query.startDate as string) : null
  const endDate = query.endDate ? new Date(query.endDate as string) : null

  // Построение условий фильтрации
  const where: any = {
    // Фильтруем результаты игр текущего пользователя (или все, если админ)
    ...(payload.role !== 'admin' && { userId: payload.userId })
  }

  if (startDate || endDate) {
    where.playedAt = {}
    if (startDate) {
      where.playedAt.gte = startDate
    }
    if (endDate) {
      where.playedAt.lte = endDate
    }
  }

  // Получение результатов игр
  const gameResults = await prisma.gameResult.findMany({
    where,
    orderBy: {
      playedAt: 'desc'
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      phone: true,
      email: true,
      mode: true,
      promoCode: true,
      playedAt: true
    }
  })

  // Подсчет общей статистики
  const totalCount = gameResults.length

  return {
    results: gameResults,
    totalCount,
    dateRange: startDate && endDate ? {
      start: startDate.toISOString(),
      end: endDate.toISOString()
    } : null
  }
})

