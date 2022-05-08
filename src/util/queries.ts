import { Challenge, ChallengeCompletion, User } from '@prisma/client'
import { ObjectId } from 'bson'
import { useMutation, useQuery, useQueryClient } from 'react-query'

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
  return useQuery(['users', id], getUser, { enabled: !!id, refetchInterval: false })
}

async function getChallengeCompletion(ctx) {
  const id = ctx.queryKey[1]
  return id ? fetch(`/api/completion/${id}`).then((r) => r.json()) : {}
}

export function useChallengeCompletion(id: string | undefined, onSuccess: (data: ChallengeCompletion) => void) {
  return useQuery(['completions', id], getChallengeCompletion, { enabled: !!id, refetchInterval: false, onSuccess })
}

async function putChallengeCompletion(challengeId: string, data: ChallengeCompletion['steps']) {
  return fetch(`/api/completion/${challengeId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export function usePutChallengeCompletion() {
  const queryClient = useQueryClient()
  const mutate = useMutation<Response, unknown, { id: string; steps: ChallengeCompletion['steps'] }>(
    async ({ id, steps }) => putChallengeCompletion(id, steps),
    {
      onSuccess: (data, variables) => {
        queryClient.setQueriesData(['completions', variables.id], data)
        queryClient.invalidateQueries({ queryKey: 'completions' })
      },
    }
  )
  return mutate
}
