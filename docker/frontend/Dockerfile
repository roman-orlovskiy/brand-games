# Dockerfile для фронтенда (Nuxt.js)
FROM node:18-alpine

# Установка рабочей директории
WORKDIR /app

# Копирование package.json файлов
COPY package*.json ./
COPY frontend/package*.json ./frontend/

# Установка зависимостей
RUN npm ci --only=production

# Копирование исходного кода
COPY frontend/ ./frontend/

# Установка зависимостей фронтенда
WORKDIR /app/frontend
RUN npm ci

# Открытие порта
EXPOSE 3000

# Команда запуска
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

