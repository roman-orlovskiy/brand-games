# Brand Games - Nuxt 4 + PostgreSQL + Prisma

Проект игр с брендингом на Nuxt 4 с PostgreSQL базой данных.

## 🚀 Быстрый старт (первый запуск)

### С Docker (рекомендуется)

1. **Установите Docker Desktop**: https://www.docker.com/products/docker-desktop/

2. **Запустите первый раз**:
```bash
npm run docker:setup
```

Эта команда автоматически:
- ✅ Запустит PostgreSQL и приложение
- ✅ Создаст структуру базы данных (миграции)
- ✅ Заполнит базу начальными данными (создаст админа)

3. **Откройте в браузере**: http://localhost:8080

4. **Вход в админку**:
   - Email: `admin@example.com`
   - Пароль: `admin123`

### Вручную (пошагово)

Если хотите запустить пошагово:

```bash
# 1. Запуск контейнеров
npm run docker:dev

# 2. Подождите 15 секунд, затем выполните миграции
docker compose exec app npx prisma migrate dev --name init
docker compose exec app npx prisma generate
docker compose exec app npm run db:seed
```

## 📋 Другие команды

```bash
# Просмотр логов
npm run docker:dev:logs

# Остановка
npm run docker:dev:stop

# Остановка с удалением данных БД (начать заново)
docker compose down -v
```

## 📚 Документация

- [Инструкция по первому запуску](./README.SETUP.md) - подробная инструкция
- [Инструкция по Docker](./README.DOCKER.md) - работа с Docker

## 🔧 Без Docker (альтернатива)

Если Docker не установлен, используйте облачную базу данных:
1. Создайте проект на https://supabase.com
2. Скопируйте connection string
3. Создайте `.env` файл с `DATABASE_URL` и `JWT_SECRET`
4. Выполните `npx prisma migrate dev --name init`
5. Запустите `npm run dev`

Подробнее в [README.SETUP.md](./README.SETUP.md)
