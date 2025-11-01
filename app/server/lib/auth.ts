import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import type { H3Event } from 'h3'

export interface JWTPayload {
  userId: string
  email: string
  role: string
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

/**
 * Генерация JWT токена
 */
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d'
  })
}

/**
 * Верификация JWT токена
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch {
    return null
  }
}

/**
 * Хеширование пароля
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

/**
 * Проверка пароля
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

/**
 * Получение токена из cookie или заголовка
 */
export function getTokenFromEvent(event: H3Event): string | null {
  const token = getCookie(event, 'auth-token') || getHeader(event, 'authorization')?.replace('Bearer ', '')
  return token || null
}

/**
 * Получение пользователя из токена
 */
export function getUserFromEvent(event: H3Event): JWTPayload | null {
  const token = getTokenFromEvent(event)
  if (!token) {
    return null
  }
  return verifyToken(token)
}

