import { Challenge, User } from '@prisma/client'
import { useQuery } from 'react-query'

async function getChallenge(ctx): Promise<Challenge & { author: User }> {
  const id = ctx.queryKey[1]
  return id ? fetch(`/api/challenges?id=${id}`).then((r) => r.json()) : {}
}

export function useChallenge(id?: string) {
  return useQuery(['challenges', id], getChallenge)
}

async function getUser(ctx): Promise<User & { challenges: Challenge }> {
  const id = ctx.queryKey[1]
  return id ? fetch(`/api/users?id=${id}`).then((r) => r.json()) : {}
}

export function useUser(id?: string) {
  console.info('what', id)
  return useQuery(['users', id], getUser)
}
