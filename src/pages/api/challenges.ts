import { Challenge, prisma, User } from '~/util/prisma'
import { NextApiHandler } from 'next'
import { getSession } from 'next-auth/react'
import { Session } from 'next-auth'

function cleanChallenge(c: Challenge & { author: User }) {
  return {
    ...c,
    author: { accountData: c.author.accountData, primaryCharacter: c.author.primaryCharacter },
  }
}

function getChallengeData(type: 'create' | 'update', req, session) {
  const tz = new Date().toISOString()
  const mappedData: Omit<Challenge, 'id'> & { id?: string } = JSON.parse(req.body)
  const id = mappedData.id
  delete (mappedData as any).description
  mappedData.authorId = session.user.id
  if (type === 'create') mappedData.createdAt = tz as unknown as Date
  mappedData.updatedAt = tz as unknown as Date
  mappedData.state = 'draft'
  if (type === 'update') delete mappedData.id
  console.info(mappedData)
  return { data: mappedData, id }
}

const handler: NextApiHandler = async (req, res) => {
  let session: Session | null
  if (req.method !== 'GET') {
    session = await getSession({ req })
    if (!session) {
      res.status(401).send({ message: 'Requires authorization' })
      return
    }
  }
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
  } else if (req.method === 'POST') {
    const { data } = getChallengeData('create', req, session!)
    const result = await prisma.challenge.create({ data })
    res.json(result)
  } else if (req.method === 'PUT') {
    const { id, data } = getChallengeData('update', req, session!)
    const result = await prisma.challenge.update({ where: { id }, data })
    res.json(result)
  } else {
    res.status(401).json({ error: 'Not implemented' })
  }
}

export default handler
