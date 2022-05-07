import { prisma } from '~/util/prisma'
import { Handlers, prepareHandle } from '~/util/api'

const handlers: Handlers = {
  GET: {
    requireAuth: true,
    fn: async function (req, res) {
      if (req.query.id) {
        const results = await prisma.challengeCompletion.findFirst({
          where: { id: req.query.id.toString() },
        })
        res.json(results)
      } else {
        const results = await prisma.challengeCompletion.findMany()
        res.json(results)
      }
    },
  },
  POST: {
    requireAuth: true,
    fn: async function (req, res, session) {
      const challengeId = req.query.challengeId.toString()
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
