import { Challenge, ChallengeSteps } from '@prisma/client'
import * as React from 'react'
import { ReadyState } from 'react-use-websocket'
import { useChallengeCompletion } from '~/util/queries'
import useLink from './useLink'

function useNotification() {
  React.useEffect(() => {
    if (window.Notification) {
      Notification.requestPermission()
    }
  }, [])
  const fireNotification = React.useCallback((step: ChallengeSteps) => {
    new Notification(`Found ${step.name}`, {
      body: step.description,
      image: `https://${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_DOMAIN}/${step.image}`,
    })
  }, [])
  return fireNotification
}

export default function useFound(challenge?: Challenge) {
  const [found, setFound] = React.useState(['626ecbf7eb01ed777b8dcfc0'])
  const { data } = useChallengeCompletion(challenge?.id)
  console.info(data)
  const { link, readyState } = useLink()
  const fireNotification = useNotification()
  React.useEffect(() => {
    if (readyState !== ReadyState.OPEN) return
    const playerLocation = {
      x: link?.avatar.position[0] || 0,
      y: link?.avatar.position[2] || 0,
      z: link?.avatar.position[1] || 0,
    }
    const foundSteps = (challenge?.steps || [])
      .filter((step) => {
        return within(playerLocation, step.location, step.precision)
      })
      .map((step) => step.id)
      .filter((id) => !found.includes(id))
    if (foundSteps.length) {
      const stepMap = new Map((challenge?.steps || []).map((s) => [s.id, s]))
      setFound((f) => {
        foundSteps.forEach((s) => fireNotification(stepMap.get(s)!))
        return [...new Set(f.concat(foundSteps))]
      })
    }
  }, [found, link, readyState, challenge, fireNotification, setFound])
  return found
}

function coordWithin(base: number, goal: number, precision: number) {
  const min = goal - parseInt(`${precision}`, 10)
  const max = goal + parseInt(`${precision}`, 10)
  return min < base && base < max
}

function within(base: { x: number; y: number; z: number }, goal: { x: number; y: number; z: number }, precision) {
  return (
    coordWithin(base.x, goal.x, precision) &&
    coordWithin(base.y, goal.y, precision) &&
    coordWithin(base.z, goal.z, precision)
  )
}
