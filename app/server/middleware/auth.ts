import { getUserFromEvent } from '~/server/lib/auth'
import { createAuthError } from '~/server/utils/errors'
import type { H3Event } from 'h3'

/**
 * Middleware для проверки аутентификации
 * Добавляет пользователя в event context
 */
export default defineEventHandler(async (event: H3Event) => {
  const user = getUserFromEvent(event)
  
  if (!user) {
    throw createAuthError()
  }
  
  // Добавляем пользователя в context для использования в handlers
  event.context.user = user
  
  // Пропускаем запрос дальше
})

