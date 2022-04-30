import { Challenge, User } from '@prisma/client'
import { ObjectId } from 'bson'
import { useQuery } from 'react-query'

async function getChallenge(ctx): Promise<Challenge & { author: User }> {
  const id = ctx.queryKey[1]
  return id ? fetch(`/api/challenges?id=${id}`).then((r) => r.json()) : { steps: [{ id: new ObjectId().toString() }] }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useChallenge(id?: string, onSettled?: (data: any) => void) {
  return useQuery(['challenges', id], getChallenge, {
    onSettled,
    enabled: !!id,
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  })
}

async function getUser(ctx): Promise<User & { challenges: Challenge }> {
  const id = ctx.queryKey[1]
  return id ? fetch(`/api/users?id=${id}`).then((r) => r.json()) : {}
}

export function useUser(id?: string) {
  return useQuery(['users', id], getUser)
}
