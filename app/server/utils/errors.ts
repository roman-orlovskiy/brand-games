import { createError } from 'h3'

/**
 * Создание ошибки аутентификации
 */
export function createAuthError(message: string = 'Не авторизован') {
  return createError({
    statusCode: 401,
    statusMessage: message
  })
}

/**
 * Создание ошибки доступа
 */
export function createForbiddenError(message: string = 'Доступ запрещен') {
  return createError({
    statusCode: 403,
    statusMessage: message
  })
}

/**
 * Создание ошибки валидации
 */
export function createValidationError(message: string = 'Ошибка валидации данных') {
  return createError({
    statusCode: 400,
    statusMessage: message
  })
}

/**
 * Создание ошибки не найдено
 */
export function createNotFoundError(message: string = 'Ресурс не найден') {
  return createError({
    statusCode: 404,
    statusMessage: message
  })
}

/**
 * Создание ошибки сервера
 */
export function createServerError(message: string = 'Внутренняя ошибка сервера') {
  return createError({
    statusCode: 500,
    statusMessage: message
  })
}

