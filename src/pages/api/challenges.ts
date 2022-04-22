import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  const challenges = await prisma.challenge.findMany({ include: { author: true } })
  const cleaned = challenges.map((c) => ({
    ...c,
    author: { accountData: c.author.accountData, primaryCharacter: c.author.primaryCharacter },
  }))
  res.json(cleaned)
}
