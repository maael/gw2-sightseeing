import fetch from 'isomorphic-fetch'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'

async function getChallenge(ctx) {
  const id = ctx.queryKey[1]
  return id ? fetch(`/api/challenges?id=${id}`).then((r) => r.json()) : {}
}

export default function Challenges() {
  const {
    query: { id },
  } = useRouter()
  const { isLoading, data = {} } = useQuery(['challenges', id], getChallenge)
  return (
    <div>
      Challenges
      {isLoading ? <div>Loading</div> : null}
      {data.name}
    </div>
  )
}
