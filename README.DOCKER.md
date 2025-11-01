# Инструкция по работе с Docker

## Разработка локально

### Запуск с Docker Compose (включая PostgreSQL)

```bash
# Запуск PostgreSQL и приложения
docker-compose up -d

# Просмотр логов
docker-compose logs -f app

# Остановка
docker-compose down

# Остановка с удалением данных БД
docker-compose down -v
```

После запуска:
- PostgreSQL доступен на `localhost:5432`
- Приложение доступно на `http://localhost:8080`

### Выполнение миграций Prisma

```bash
# Запуск миграций
docker-compose exec app npx prisma migrate dev --name init

# Генерация Prisma Client
docker-compose exec app npx prisma generate

# Заполнение начальными данными
docker-compose exec app npm run db:seed

# Или через PowerShell
docker-compose exec app sh -c "npx prisma migrate dev --name init"
```

## Production деплой

### 1. Локальный деплой (для тестирования)

```bash
# Сборка и запуск production версии
docker-compose -f docker-compose.prod.yml up -d --build

# Просмотр логов
docker-compose -f docker-compose.prod.yml logs -f

# Остановка
docker-compose -f docker-compose.prod.yml down
```

### 2. Деплой на сервер

#### Вариант A: Docker Compose на сервере

1. Скопируйте на сервер:
   - `Dockerfile`
   - `docker-compose.prod.yml`
   - `.env` файл с production переменными
   - Весь код проекта

2. На сервере:
```bash
# Сборка и запуск
docker-compose -f docker-compose.prod.yml up -d --build

# Выполнение миграций
docker-compose -f docker-compose.prod.yml exec app npx prisma migrate deploy
```

#### Вариант B: Отдельные Docker образы

1. Соберите образ:
```bash
docker build -t brandgames:latest .
```

2. Запустите PostgreSQL и приложение отдельно:
```bash
docker run -d --name postgres \
  -e POSTGRES_PASSWORD=yourpassword \
  -e POSTGRES_DB=brandgames \
  -v postgres_data:/var/lib/postgresql/data \
  postgres:16-alpine

docker run -d --name brandgames-app \
  -p 3000:3000 \
  --link postgres:postgres \
  -e DATABASE_URL="postgresql://postgres:yourpassword@postgres:5432/brandgames?schema=public" \
  -e JWT_SECRET="your-secret-key" \
  brandgames:latest
```

## Переменные окружения

Создайте `.env` файл или используйте переменные окружения:

```env
DATABASE_URL="postgresql://postgres:postgres@postgres:5432/brandgames?schema=public"
JWT_SECRET="your-secret-key-change-in-production"
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=brandgames
```

## Преимущества Docker для деплоя

✅ Все зависимости изолированы в контейнерах
✅ Одинаковая среда на локальной машине и сервере
✅ Легко масштабировать (можно добавить несколько контейнеров)
✅ Простое обновление (пересборка образа и перезапуск)
✅ Легко откатить изменения (использовать предыдущий образ)
✅ Автоматический рестарт при сбоях

## Полезные команды

```bash
# Просмотр запущенных контейнеров
docker ps

# Просмотр логов
docker logs brandgames-app

# Вход в контейнер
docker exec -it brandgames-app sh

# Остановка всех контейнеров
docker-compose down

# Пересборка без кеша
docker-compose build --no-cache

# Просмотр используемых ресурсов
docker stats
```

