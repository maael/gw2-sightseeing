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
    fn: async function (req, res, { session, id }) {
      const results = await prisma.challengeCompletion.findFirst({
        where: { id: id!, userId: session.user.id },
      })
      res.json(results || {})
    },
  },
  POST: {
    requireAuth: true,
    fn: async function (_, res, { session, id: challengeId }) {
      if (!challengeId) {
        res.status(401).send({ message: 'Requires challenge id' })
        return
      }
      const result = await prisma.challengeCompletion.upsert({
        where: { id: '' },
        create: { challengeId, userId: session.user.id },
        update: { challengeId },
      })
      res.json(result)
    },
  },
}

const handle = prepareHandle(handlers)

export default handle
