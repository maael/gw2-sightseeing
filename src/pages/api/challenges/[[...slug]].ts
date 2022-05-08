import { Challenge, prisma, User } from '~/util/prisma'
import { Handlers, prepareHandle } from '~/util/api'

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

const handlers: Handlers = {
  GET: {
    fn: async function (_, res, { session }) {
      const challenges = await prisma.challenge.findMany({
        include: { author: true },
        where: { OR: [{ state: { equals: 'active' } }, { authorId: { equals: session?.user.id } }] },
      })
      const cleaned = challenges.map(cleanChallenge)
      res.json(cleaned)
    },
  },
  'GET/:id': {
    fn: async function (_, res, { id }) {
      const challenge = await prisma.challenge.findFirst({
        where: { id: id! },
        include: { author: true },
      })
      res.json(challenge ? cleanChallenge(challenge) : null)
    },
  },
  POST: {
    requireAuth: true,
    fn: async function (req, res, { session }) {
      const { data } = getChallengeData('create', req, session!)
      const result = await prisma.challenge.create({ data })
      res.json(result)
    },
  },
  PUT: {
    requireAuth: true,
    fn: async function (req, res, { session }) {
      const { id, data } = getChallengeData('update', req, session!)
      const result = await prisma.challenge.update({ where: { id }, data })
      res.json(result)
    },
  },
}

const handle = prepareHandle(handlers)

export default handle
