import { NextApiRequest, NextApiResponse } from 'next'
import { Session } from 'next-auth'
import { getSession } from 'next-auth/react'

export type Handlers = Record<
  string,
  | {
      fn: (
        req: NextApiRequest,
        res: NextApiResponse,
        info: { session: Session; id: string | null }
      ) => void | Promise<void>
      requireAuth: true
    }
  | {
      fn: (
        req: NextApiRequest,
        res: NextApiResponse,
        info: { session: Session | null; id: string | null }
      ) => void | Promise<void>
      requireAuth?: false
    }
>

export const prepareHandle = (handlers: Handlers) => async (req: NextApiRequest, res: NextApiResponse) => {
  const possibleHandlers = { general: handlers[req.method!], id: handlers[`${req.method}/:id`] }
  const foundId = req.query.slug && req.query.slug.length ? req.query.slug[0] : null
  const session = await getSession({ req })
  const activeHandler = foundId ? possibleHandlers.id : possibleHandlers.general
  if (activeHandler) {
    if (activeHandler.requireAuth && !session) {
      res.status(401).send({ message: 'Requires authorization' })
      return
    }
    try {
      await activeHandler.fn(req, res, { session: session!, id: foundId })
    } catch (e) {
      console.error(e)
      res.status(500).json({ error: e.message })
    }
  } else {
    res.status(401).json({ error: 'Not implemented' })
  }
}
