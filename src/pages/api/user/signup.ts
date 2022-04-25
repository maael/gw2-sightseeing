import { PrismaClient } from '@prisma/client'
import { NextApiHandler } from 'next'

const prisma = new PrismaClient()

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(401).json({ error: 'Not implemented' })
    return
  }
  const ts = new Date().toISOString()
  // TODO: Get data from GW2 API
  const _user = await prisma.user.create({
    data: {
      apiKey: req.body.apiKey,
      accountData: { characters: [], name: '' },
      primaryCharacter: 0,
      settings: { mode: 'dark' },
      status: 'enabled',
      createdAt: ts,
      updatedAt: ts,
    },
  })
  // TODO: Sign in straight away without going through flow again
  res.redirect('/api/auth/signin')
}

export default handler
