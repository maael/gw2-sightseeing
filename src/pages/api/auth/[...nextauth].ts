import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

import { PrismaClient } from '@prisma/client'
import { BasicUser } from '~/types/next-auth'

const prisma = new PrismaClient()

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
      name: 'Guild Wars 2 API Key',
      credentials: {
        token: { label: 'GW2 API Key', type: 'text', placeholder: 'Key...' },
      },
      async authorize(credentials, _req) {
        if (!credentials?.token) return null
        const result = await prisma.user.findFirst({ where: { apiKey: credentials?.token } })
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
