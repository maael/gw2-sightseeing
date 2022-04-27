import _NextAuth from 'next-auth'

interface BasicUser {
  accountData: {
    characters: Array<{
      age: number
      class: string
      gender: string
      guild: string
      name: string
      profession: string
      race: string
    }>
    guilds: Array<{
      id: string
      name: string
      tag: string
    }>
    name: string
  }
  settings: {
    mode: 'dark' | 'light'
  }
  primaryCharacter: number
  id: string
}

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
