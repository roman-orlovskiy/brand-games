# Первый запуск проекта для Windows (PowerShell)

Write-Host "🚀 Первый запуск проекта..." -ForegroundColor Cyan
Write-Host ""

# Запуск Docker контейнеров
Write-Host "📦 Запуск Docker контейнеров..." -ForegroundColor Yellow
docker compose up -d

# Ждем пока PostgreSQL запустится
Write-Host "⏳ Ожидание запуска PostgreSQL (15 секунд)..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Проверка что контейнеры запущены
$containers = docker compose ps
if ($containers -notmatch "Up") {
    Write-Host "❌ Ошибка: Контейнеры не запустились" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Контейнеры запущены" -ForegroundColor Green
Write-Host ""

# Выполнение миграций
Write-Host "🗄️  Выполнение миграций Prisma..." -ForegroundColor Yellow
docker compose exec app npx prisma migrate dev --name init

# Генерация Prisma Client
Write-Host "⚙️  Генерация Prisma Client..." -ForegroundColor Yellow
docker compose exec app npx prisma generate

# Заполнение начальными данными
Write-Host "🌱 Заполнение базы данных начальными данными..." -ForegroundColor Yellow
docker compose exec app npm run db:seed

Write-Host ""
Write-Host "✅ Готово! Проект запущен и настроен!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Приложение доступно на: http://localhost:8080" -ForegroundColor Cyan
Write-Host "👤 Админ: admin@example.com / admin123" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 Просмотр логов: npm run docker:dev:logs" -ForegroundColor Yellow
Write-Host "🛑 Остановка: npm run docker:dev:stop" -ForegroundColor Yellow

