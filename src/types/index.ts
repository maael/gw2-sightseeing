import { Challenge } from '@prisma/client'

export type ChallengeForm = Omit<Challenge, 'id' | 'steps' | 'createdAt' | 'updatedAt' | 'likes' | 'authorId'> & {
  id?: string
  steps: Array<Omit<Challenge['steps'][0], 'image'> & { image: string | File }>
}
