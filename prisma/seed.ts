import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Начало заполнения базы данных...')

  // Хеширование пароля для админа
  const hashedPassword = await bcrypt.hash('admin123', 10)

  // Создание тестового администратора
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: hashedPassword,
      name: 'Администратор',
      companyName: 'Тестовая компания',
      role: 'admin'
    }
  })

  console.log('Создан администратор:', admin.email)

  // Создание дефолтных настроек бренда для админа
  const defaultColors = [
    { 
      id: 'main', 
      name: 'Основной', 
      color: '#00BCD4',
      description: 'Главный цвет бренда'
    },
    { 
      id: 'additional', 
      name: 'Доп', 
      color: '#00BFA5',
      description: 'Вторичный цвет для акцентов и кнопок'
    },
    { 
      id: 'neutral', 
      name: 'Нейтральный', 
      color: '#C27BA0',
      description: 'Цвет для текста и фоновых элементов'
    },
    { 
      id: 'background', 
      name: 'Фоновый', 
      color: '#FFFDE7',
      description: 'Основной фоновый цвет интерфейса'
    },
    { 
      id: 'accent', 
      name: 'Акцентный', 
      color: '#FF6B6B',
      description: 'Цвет для выделения важных элементов'
    }
  ]

  const brandSettings = await prisma.brandSettings.upsert({
    where: { userId: admin.id },
    update: {},
    create: {
      userId: admin.id,
      colors: defaultColors as any
    }
  })

  console.log('Созданы настройки бренда для администратора')

  // Создание дефолтных настроек игры для админа
  const defaultGameColors = [
    { id: 'tree', name: 'Дерево', brandColorId: 'main', color: '#00BCD4' },
    { id: 'crown', name: 'Крона', brandColorId: 'additional', color: '#00BFA5' },
    { id: 'trajectory', name: 'Траектория', brandColorId: 'accent', color: '#FF6B6B' },
    { id: 'archer', name: 'Майка лучника', brandColorId: 'accent', color: '#FF6B6B' },
    { id: 'bow', name: 'Лук', brandColorId: 'neutral', color: '#C27BA0' },
    { id: 'arrow', name: 'Стрела', brandColorId: 'neutral', color: '#C27BA0' },
    { id: 'background', name: 'Фон', brandColorId: 'background', color: '#FFFDE7' },
    { id: 'land', name: 'Земля', brandColorId: 'additional', color: '#00BFA5' },
    { id: 'prizes', name: 'Призы', brandColorId: 'accent', color: '#FF6B6B' },
    { id: 'box', name: 'Корзина', brandColorId: 'neutral', color: '#C27BA0' },
    { id: 'trash', name: 'Мусор', brandColorId: 'neutral', color: '#C27BA0' },
    { id: 'interface', name: 'Интерфейс', brandColorId: 'main', color: '#00BCD4' }
  ]

  const defaultPrizes = [
    { id: '1', name: 'Подарок 1', discount: 3 },
    { id: '2', name: 'Подарок 2', discount: 3 },
    { id: '3', name: 'Подарок 3', discount: 3 },
    { id: '4', name: 'Подарок 4', discount: 3 }
  ]

  const defaultFormSettings = {
    submitButtonColor: '#00BCD4',
    overlayBackgroundColor: '#C27BA0',
    titleText: 'Итоги игры',
    descriptionText: 'Чтобы получить промокод заполните контактные данные',
    buttonText: 'Получить промокод',
    discountDescription: 'Ваша скидка<br>Промокод действует до конца месяца',
    defaultPromoCode: 'BRAND2025'
  }

  const gameSettings = await prisma.gameSettings.upsert({
    where: { userId: admin.id },
    update: {},
    create: {
      userId: admin.id,
      colors: defaultGameColors as any,
      prizesCount: 4,
      badPrizesCount: 3,
      logoUrl: null,
      prizes: defaultPrizes as any,
      discountMode: 'max',
      shotsCount: 3,
      formSettings: defaultFormSettings as any
    }
  })

  console.log('Созданы настройки игры для администратора')
  console.log('Заполнение базы данных завершено!')
}

main()
  .catch((e) => {
    console.error('Ошибка при заполнении базы данных:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

