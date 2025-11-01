# Multi-stage build для оптимизации размера образа

# Stage 1: Builder
FROM node:20-alpine AS builder

WORKDIR /app

# Установка зависимостей
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci

# Генерация Prisma Client
RUN npx prisma generate

# Копирование исходников
COPY . .

# Сборка приложения
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS production

WORKDIR /app

# Установка только production зависимостей
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci --only=production

# Генерация Prisma Client
RUN npx prisma generate

# Копирование собранного приложения из builder
COPY --from=builder /app/.output ./.output

# Копирование публичных файлов
COPY public ./public

# Открываем порт
EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000
ENV NITRO_PORT=3000
ENV NITRO_HOST=0.0.0.0

# Запуск приложения
CMD ["node", ".output/server/index.mjs"]

