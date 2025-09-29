# Быстрый старт

## 🚀 Запуск проекта

### 1. Установка зависимостей
```bash
npm run install:all
```

### 2. Запуск в режиме разработки
```bash
# Запустить фронтенд и бэкенд одновременно
npm run dev

# Или по отдельности:
npm run dev:frontend    # http://localhost:3000
npm run dev:backend     # http://localhost:3001
```

### 3. Запуск с Docker
```bash
# Запустить все сервисы (MySQL, Redis, Frontend, Backend)
docker-compose up -d

# Остановить все сервисы
docker-compose down
```

## 📁 Структура проекта

- `frontend/` - Nuxt.js приложение (порт 3000)
- `backend/` - NestJS API (порт 3001)
- `docker/` - Docker конфигурации
- `game-decomposition.md` - Детальное описание проекта

## 🔧 Доступные команды

| Команда | Описание |
|---------|----------|
| `npm run dev` | Запуск фронтенда и бэкенда |
| `npm run build` | Сборка всех проектов |
| `npm run lint` | Линтинг кода |
| `npm run clean` | Очистка node_modules |

## 🌐 Доступные URL

- **Фронтенд**: http://localhost:3000
- **Бэкенд API**: http://localhost:3001
- **MySQL**: localhost:3306
- **Redis**: localhost:6379

## 📝 Следующие шаги

1. Настроить базу данных MySQL
2. Добавить аутентификацию JWT
3. Создать игровую логику
4. Реализовать систему брендинга
5. Добавить административную панель

Подробное описание проекта смотрите в `game-decomposition.md`

