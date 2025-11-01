/**
 * Composable для работы с API
 * Предоставляет общие методы для запросов с обработкой ошибок
 */
export const useApi = () => {
  /**
   * Безопасный запрос к API с обработкой ошибок
   */
  const apiRequest = async <T>(
    url: string,
    options: RequestInit = {}
  ): Promise<T> => {
    try {
      const response = await $fetch<T>(url, {
        ...options,
        credentials: 'include' // Включаем cookies для аутентификации
      })
      return response
    } catch (error: any) {
      // Обработка ошибок
      const message = error.data?.message || error.message || 'Произошла ошибка'
      throw new Error(message)
    }
  }

  return {
    apiRequest
  }
}

