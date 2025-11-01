# Инструкция по первому запуску проекта

## Быстрый старт с Docker (рекомендуется)

### Шаг 1: Установка Docker Desktop

Если Docker Desktop не установлен:
1. Скачайте и установите: https://www.docker.com/products/docker-desktop/
2. Перезапустите компьютер после установки
3. Запустите Docker Desktop (должен быть запущен)

### Шаг 2: Первый запуск проекта

```bash
# 1. Запуск PostgreSQL и приложения (Docker сам создаст базу данных)
npm run docker:dev

# Подождите 10-15 секунд, пока контейнеры запустятся
# Проверьте логи:
npm run docker:dev:logs
```

### Шаг 3: Выполнение миграций Prisma

После того как контейнеры запустятся, нужно создать структуру базы данных:

```bash
# Выполнение миграций (создаст таблицы в БД)
docker compose exec app npx prisma migrate dev --name init

# Генерация Prisma Client
docker compose exec app npx prisma generate

# Заполнение начальными данными (создаст админа: admin@example.com / admin123)
docker compose exec app npm run db:seed
```

### Шаг 4: Готово!

- Приложение доступно на: http://localhost:8080
- PostgreSQL работает внутри Docker контейнера
- База данных уже создана и заполнена тестовыми данными

## Что делает Docker автоматически:

✅ Создает и запускает PostgreSQL контейнер
✅ Создает базу данных `brandgames`
✅ Запускает приложение в контейнере
✅ Настраивает сеть между контейнерами

## Что нужно сделать вручную:

⚠️ Выполнить миграции Prisma (создать таблицы)
⚠️ Заполнить начальными данными (создать админа)

## Команды для работы:

```bash
# Запуск
npm run docker:dev

# Просмотр логов
npm run docker:dev:logs

# Остановка
npm run docker:dev:stop

# Остановка с удалением данных БД (начать заново)
docker compose down -v
```

## Альтернативный способ (без Docker)

Если Docker не установлен, можно использовать облачную базу данных:

1. Создайте бесплатную базу на https://supabase.com
2. Скопируйте connection string
3. Создайте `.env` файл:
   ```env
   DATABASE_URL="ваш_connection_string_от_supabase"
   JWT_SECRET="генерируйте_случайную_строку_минимум_32_символа"
   ```
4. Выполните миграции:
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   npm run db:seed
   ```
5. Запустите приложение:
   ```bash
   npm run dev
   ```

## Вход в админку после первого запуска:

- Email: `admin@example.com`
- Пароль: `admin123`

⚠️ **Важно**: Смените пароль после первого входа!

