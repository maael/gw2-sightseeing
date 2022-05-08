import { prisma } from '~/util/prisma'
import { Handlers, prepareHandle } from '~/util/api'

const handlers: Handlers = {
  GET: {
    requireAuth: true,
    fn: async function (req, res, { session }) {
      const results = await prisma.challengeCompletion.findMany({
        where: { userId: session.user.id },
      })
      res.json(results || [])
    },
  },
  'GET/:id': {
    requireAuth: true,
    fn: async function (req, res, { session, id: challengeId }) {
      const results = await prisma.challengeCompletion.findFirst({
        where: { challengeId: challengeId!, userId: session.user.id },
      })
      res.json(results || {})
    },
  },
  'PUT/:id': {
    requireAuth: true,
    fn: async function (req, res, { session, id: challengeId }) {
      if (!challengeId) {
        res.status(401).send({ message: 'Requires challenge id' })
        return
      }
      console.info('body', typeof req.body)
      const result = await prisma.challengeCompletion.upsert({
        where: { challengeId_userId: { challengeId, userId: session.user.id } },
        create: { challengeId, userId: session.user.id, steps: { set: JSON.parse(req.body) } },
        update: { steps: { set: JSON.parse(req.body) } },
      })
      res.json(result)
    },
  },
}

const handle = prepareHandle(handlers)

export default handle
