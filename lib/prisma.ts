import { PrismaClient } from "@prisma/client"

declare global {
  var __prisma: PrismaClient | undefined
}

const prismaClient = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})

export const prisma = globalThis.__prisma || prismaClient

if (process.env.NODE_ENV !== "production") {
  globalThis.__prisma = prisma
}
