export * from '@prisma/client'
import { PrismaClient } from '@prisma/client'

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

// eslint-disable-next-line @typescript-eslint/no-extra-semi
;(BigInt.prototype as any).toJSON = function () {
  return this.toString()
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') global.prisma = prisma
