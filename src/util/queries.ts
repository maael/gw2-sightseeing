import { Challenge, User } from '@prisma/client'
import { ObjectId } from 'bson'
import { useQuery } from 'react-query'

async function getChallenge(ctx): Promise<Challenge & { author: User }> {
  const id = ctx.queryKey[1]
  return id ? fetch(`/api/challenges/${id}`).then((r) => r.json()) : { steps: [{ id: new ObjectId().toString() }] }
}

export function useChallenge(id?: string, onSettled?: (data: any) => void) {
  return useQuery<Challenge>(['challenges', id], getChallenge, {
    onSettled,
    enabled: !!id,
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
  })
}

async function getUser(ctx): Promise<User & { challenges: Challenge }> {
  const id = ctx.queryKey[1]
  return id ? fetch(`/api/users/${id}`).then((r) => r.json()) : {}
}

export function useUser(id?: string) {
  return useQuery(['users', id], getUser, { enabled: !!id })
}
