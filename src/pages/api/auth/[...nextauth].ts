import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

import { BasicUser } from '~/types/next-auth'
import { getUserByToken } from '~/util/auth'

function isUserToken(token: object): token is BasicUser {
  // eslint-disable-next-line no-prototype-builtins
  return token.hasOwnProperty('accountData')
}

export default NextAuth({
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  providers: [
    CredentialsProvider({
      id: 'gw2-api-key',
      name: 'Guild Wars 2 API Key',
      credentials: {
        apiKey: { label: 'GW2 API Key', type: 'text', placeholder: 'Key...' },
      },
      async authorize(credentials, _req) {
        if (!credentials?.apiKey) return null
        const result = await getUserByToken(credentials.apiKey)
        if (result) {
          return result
        } else {
          return null
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.accountData = user.accountData
        token.settings = user.settings
        token.primaryCharacter = user.primaryCharacter
        token.id = user.id
        token.name = user.accountData.name
      }
      return token
    },
    session({ session, token }) {
      if (isUserToken(token)) {
        session.user.accountData = token.accountData
        session.user.settings = token.settings
        session.user.primaryCharacter = token.primaryCharacter
        session.user.id = token.id
      }
      return session
    },
  },
})
