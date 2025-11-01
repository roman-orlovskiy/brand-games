#!/bin/bash

echo "🚀 Первый запуск проекта..."
echo ""

# Запуск Docker контейнеров
echo "📦 Запуск Docker контейнеров..."
docker compose up -d

# Ждем пока PostgreSQL запустится
echo "⏳ Ожидание запуска PostgreSQL (15 секунд)..."
sleep 15

# Проверка что контейнеры запущены
if ! docker compose ps | grep -q "Up"; then
  echo "❌ Ошибка: Контейнеры не запустились"
  exit 1
fi

echo "✅ Контейнеры запущены"
echo ""

# Выполнение миграций
echo "🗄️  Выполнение миграций Prisma..."
docker compose exec -T app npx prisma migrate dev --name init

# Генерация Prisma Client
echo "⚙️  Генерация Prisma Client..."
docker compose exec -T app npx prisma generate

# Заполнение начальными данными
echo "🌱 Заполнение базы данных начальными данными..."
docker compose exec -T app npm run db:seed

echo ""
echo "✅ Готово! Проект запущен и настроен!"
echo ""
echo "🌐 Приложение доступно на: http://localhost:8080"
echo "👤 Админ: admin@example.com / admin123"
echo ""
echo "📝 Просмотр логов: npm run docker:dev:logs"
echo "🛑 Остановка: npm run docker:dev:stop"

