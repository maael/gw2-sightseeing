import { NextApiRequest, NextApiResponse } from 'next'
import { Session } from 'next-auth'
import { getSession } from 'next-auth/react'

export type Handlers = Record<
  string,
  | {
      fn: (req: NextApiRequest, res: NextApiResponse, session: Session) => void | Promise<void>
      requireAuth: true
    }
  | {
      fn: (req: NextApiRequest, res: NextApiResponse, session: Session | null) => void | Promise<void>
      requireAuth?: false
    }
>

export const prepareHandle = (handlers: Handlers) => async (req: NextApiRequest, res: NextApiResponse) => {
  const handler = handlers[req.method!]
  const session = await getSession({ req })
  if (handler) {
    if (handler.requireAuth) {
      res.status(401).send({ message: 'Requires authorization' })
      return
    }
    await handler.fn(req, res, session)
  } else {
    res.status(401).json({ error: 'Not implemented' })
  }
}
