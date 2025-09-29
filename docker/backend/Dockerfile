# Dockerfile для бэкенда (NestJS)
FROM node:18-alpine

# Установка рабочей директории
WORKDIR /app

# Копирование package.json файлов
COPY package*.json ./
COPY backend/package*.json ./backend/

# Установка зависимостей
RUN npm ci --only=production

# Копирование исходного кода
COPY backend/ ./backend/

# Установка зависимостей бэкенда
WORKDIR /app/backend
RUN npm ci

# Открытие порта
EXPOSE 3001

# Команда запуска
CMD ["npm", "run", "start:dev"]

