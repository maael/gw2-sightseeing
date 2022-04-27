import { Challenge, PrismaClient, User } from '@prisma/client'
import { NextApiHandler } from 'next'

const prisma = new PrismaClient()

function clean(user: User & { challenges: Challenge[] }) {
  return {
    accountData: user.accountData,
    primaryCharacter: user.primaryCharacter,
    challenges: user.challenges.map(({ name, id }) => ({ name, id })),
  }
}

const handler: NextApiHandler = async (req, res) => {
  if (req.method === 'GET') {
    if (req.query.id) {
      const user = await prisma.user.findFirst({
        // TODO: This doesn't seem to work with prisma, so move name to top level
        where: { accountData: { name: req.query.id.toString() } },
        // TODO: Maybe don't include challenges, as for /users/me we can use the id directly
        // TODO: might be faster too
        include: { challenges: true },
      })
      console.info(req.query.id.toString(), user)
      res.json(user ? clean(user) : null)
    } else {
      const users = await prisma.user.findMany({ include: { challenges: true } })
      const cleaned = users.map(clean)
      res.json(cleaned)
    }
  } else {
    res.status(401).json({ error: 'Not implemented' })
  }
}

export default handler
