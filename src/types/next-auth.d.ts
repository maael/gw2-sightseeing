import _NextAuth from 'next-auth'
import { User } from '@prisma/client'

type BasicUser = Pick<User, 'accountData' | 'settings' | 'primaryCharacter' | 'id'>

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: BasicUser & { name: string }
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface User extends BasicUser {}
}
