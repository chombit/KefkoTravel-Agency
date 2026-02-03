import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create a test user
  const hashedPassword = await bcrypt.hash('password123', 10)
  
  const user = await prisma.user.upsert({
    where: { email: 'test@kefkotravel.com' },
    update: {},
    create: {
      email: 'test@kefkotravel.com',
      name: 'Test User',
      password: hashedPassword,
      role: 'USER',
      phone: '+251911234567',
      nationality: 'Ethiopian',
    },
  })

  // Create an admin user
  const adminHashedPassword = await bcrypt.hash('admin123', 10)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@kefkotravel.com' },
    update: {},
    create: {
      email: 'admin@kefkotravel.com',
      name: 'Admin User',
      password: adminHashedPassword,
      role: 'ADMIN',
      phone: '+251911234568',
      nationality: 'Ethiopian',
    },
  })

  console.log('Database seeded successfully!')
  console.log('Test user: test@kefkotravel.com / password123')
  console.log('Admin user: admin@kefkotravel.com / admin123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
