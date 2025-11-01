/**
 * Валидация email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Валидация телефона (российский формат)
 */
export function isValidPhone(phone: string): boolean {
  // Проверяем формат: +7 900 123-45-67 или +7 900 123 45 67
  const phoneRegex = /^\+7\s?\d{3}\s?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/
  return phoneRegex.test(phone)
}

/**
 * Валидация пароля
 */
export function isValidPassword(password: string): boolean {
  // Минимум 6 символов
  return password.length >= 6
}

/**
 * Валидация имени
 */
export function isValidName(name: string): boolean {
  // Минимум 2 символа
  return name.trim().length >= 2
}

