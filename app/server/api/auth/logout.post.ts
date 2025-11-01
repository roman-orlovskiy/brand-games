export default defineEventHandler(async (event) => {
  // Удаление cookie с токеном
  deleteCookie(event, 'auth-token', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict'
  })

  return {
    success: true,
    message: 'Вы успешно вышли из системы'
  }
})

