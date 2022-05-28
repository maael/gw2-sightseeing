import { ReadyState } from 'react-use-websocket'
import useLink from '~/components/hooks/useLink'
import Scroll from '~/components/primitives/Scroll'

export default function ConnectionAdventure() {
  const { link, mapData, specData, continentData, readyState } = useLink()

  const identity = link?.identity
  const context = link?.context

  return (
    <>
      {readyState !== ReadyState.OPEN ? null : (
        <Scroll outerClassName="mb-4">
          Following the adventures of {identity?.name}, a {identity?.raceName || ''}{' '}
          {specData && specData.elite ? specData.name : ''} {identity?.professionName || ''}
          {context?.mountName ? ` on a ${context.mountName}` : ''}
          {mapData
            ? ` in ${
                mapData.name === 'Fractals of the Mists'
                  ? Object.values(continentData?.sectors || {})[0]?.name || mapData.name
                  : mapData.name
              }`
            : ''}
        </Scroll>
      )}
    </>
  )
}
