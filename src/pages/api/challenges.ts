import { Challenge, PrismaClient, User } from '@prisma/client'
import { NextApiHandler } from 'next'

const prisma = new PrismaClient()

function cleanChallenge(c: Challenge & { author: User }) {
  return {
    ...c,
    author: { accountData: c.author.accountData, primaryCharacter: c.author.primaryCharacter },
  }
}

const handler: NextApiHandler = async (req, res) => {
  if (req.method === 'GET') {
    if (req.query.id) {
      const challenge = await prisma.challenge.findFirst({
        where: { id: req.query.id.toString() },
        include: { author: true },
      })
      res.json(challenge ? cleanChallenge(challenge) : null)
    } else {
      const challenges = await prisma.challenge.findMany({ include: { author: true } })
      const cleaned = challenges.map(cleanChallenge)
      res.json(cleaned)
    }
  } else {
    res.status(401).json({ error: 'Not implemented' })
  }
}

export default handler
