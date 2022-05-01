export interface ChallengeForm {
  id?: string
  name: string
  description: string
  steps: Array<{
    id: string
    name: string
    image: string | File
    location: {
      x: number
      y: number
      z: number
    }
    precision: number
  }>
  category: string
}
