import { getUserFromEvent } from '~/server/lib/auth'
import { createAuthError, createForbiddenError } from '~/server/utils/errors'
import type { H3Event } from 'h3'

/**
 * Middleware для проверки роли администратора
 */
export default defineEventHandler(async (event: H3Event) => {
  const user = getUserFromEvent(event)
  
  if (!user) {
    throw createAuthError()
  }
  
  if (user.role !== 'admin') {
    throw createForbiddenError('Требуются права администратора')
  }
  
  // Добавляем пользователя в context
  event.context.user = user
})

