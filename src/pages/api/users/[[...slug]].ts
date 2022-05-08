import { Challenge, prisma, User } from '~/util/prisma'
import { prepareHandle, Handlers } from '~/util/api'

function clean(user: User & { challenges: Challenge[] }) {
  return {
    accountData: user.accountData,
    primaryCharacter: user.primaryCharacter,
    challenges: user.challenges.map(({ name, id }) => ({ name, id })),
  }
}

const handlers: Handlers = {
  GET: {
    fn: async function (_, res) {
      const users = await prisma.user.findMany({
        include: { challenges: true },
        where: { status: { equals: 'active' } },
      })
      const cleaned = users.map(clean)
      res.json(cleaned)
    },
  },
  'GET/:id': {
    fn: async function (_, res, { id }) {
      const user = await prisma.user.findFirst({
        where: { gw2Name: id! },
        // TODO: Maybe don't include challenges, as for /users/me we can use the id directly
        // TODO: might be faster too
        include: { challenges: true },
      })
      res.json(user ? clean(user) : null)
    },
  },
}

const handle = prepareHandle(handlers)

export default handle
