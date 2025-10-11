/**
 * Затемняет цвет на указанный процент
 * @param color - HEX цвет (например, "#FF0000")
 * @param percent - процент затемнения (0-100)
 * @returns затемненный HEX цвет
 */
export const darkenColor = (color: string, percent: number): string => {
  // Удаляем # если есть
  const hex = color.replace('#', '')
  
  // Конвертируем в RGB
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  
  // Затемняем на указанный процент
  const darkenedR = Math.max(0, Math.floor(r * (1 - percent / 100)))
  const darkenedG = Math.max(0, Math.floor(g * (1 - percent / 100)))
  const darkenedB = Math.max(0, Math.floor(b * (1 - percent / 100)))
  
  // Конвертируем обратно в HEX
  const toHex = (n: number) => n.toString(16).padStart(2, '0')
  return `#${toHex(darkenedR)}${toHex(darkenedG)}${toHex(darkenedB)}`
}

/**
 * Осветляет цвет на указанный процент
 * @param color - HEX цвет (например, "#FF0000")
 * @param percent - процент осветления (0-100)
 * @returns осветленный HEX цвет
 */
export const lightenColor = (color: string, percent: number): string => {
  // Удаляем # если есть
  const hex = color.replace('#', '')
  
  // Конвертируем в RGB
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  
  // Осветляем на указанный процент
  const lightenedR = Math.min(255, Math.floor(r + (255 - r) * (percent / 100)))
  const lightenedG = Math.min(255, Math.floor(g + (255 - g) * (percent / 100)))
  const lightenedB = Math.min(255, Math.floor(b + (255 - b) * (percent / 100)))
  
  // Конвертируем обратно в HEX
  const toHex = (n: number) => n.toString(16).padStart(2, '0')
  return `#${toHex(lightenedR)}${toHex(lightenedG)}${toHex(lightenedB)}`
}

