import { useMemo, useRef } from 'react'
import useWebSocket from 'react-use-websocket'
import { professionMap, mountMap, raceMap } from '~/data/link'
import { LinkData } from '~/types/dessa'
import { ApiMap, ApiSpec, ApiContinent } from '~/types/api'
import { useQueries, useQuery } from 'react-query'

async function getMapData({ queryKey }): Promise<null | ApiMap> {
  return queryKey[1] ? fetch(`https://api.guildwars2.com/v2/maps/${queryKey[1]}`).then((r) => r.json()) : null
}

async function getSpecData({ queryKey }): Promise<null | ApiSpec> {
  return queryKey[1]
    ? fetch(`https://api.guildwars2.com/v2/specializations/${queryKey[1]}`).then((r) => r.json())
    : null
}

async function getContinentData({ queryKey }): Promise<null | ApiContinent> {
  const mapData = queryKey[1]
  return mapData
    ? fetch(
        `https://api.guildwars2.com/v2/continents/${mapData.continent_id}/floors/${mapData.default_floor}/regions/${mapData.region_id}/maps/${mapData.id}`
      ).then((r) => r.json())
    : null
}

export default function useLink() {
  const { readyState, lastJsonMessage } = useWebSocket('ws://localhost:3012', {
    reconnectInterval: 5000,
    reconnectAttempts: Infinity,
    shouldReconnect: () => true,
    share: true,
    filter: (m) => {
      try {
        const j = JSON.parse(m.data)
        return j.type === 'link'
      } catch {
        return false
      }
    },
  })
  const lastLinkMessage = useRef<LinkData | null>(null)
  lastLinkMessage.current = useMemo(() => {
    if (!lastJsonMessage || lastJsonMessage.type !== 'link') return lastLinkMessage.current
    delete lastJsonMessage.context.server_address
    return lastJsonMessage
  }, [lastJsonMessage])
  const results = useQueries([
    { queryKey: ['spec', lastLinkMessage.current?.identity.spec], queryFn: getSpecData },
    { queryKey: ['map', lastLinkMessage.current?.context.map_id], queryFn: getMapData },
  ])
  const continent = useQuery({ queryKey: ['continent', results[1].data], queryFn: getContinentData })
  return {
    readyState,
    link: lastLinkMessage.current
      ? {
          ...lastLinkMessage.current,
          identity: {
            ...lastLinkMessage.current.identity,
            professionName: professionMap[lastLinkMessage.current.identity.profession],
            raceName: raceMap[lastLinkMessage.current.identity.race],
          },
          context: {
            ...lastLinkMessage.current.context,
            mountName: mountMap[lastLinkMessage.current.context.mount_index],
          },
        }
      : null,
    mapData: results[1].data,
    specData: results[0].data,
    continentData: continent,
  }
}
