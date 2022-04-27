import fetch from 'isomorphic-fetch'
import Link from 'next/link'
import { useQuery } from 'react-query'

async function getChallenges() {
  return fetch('/api/challenges').then((r) => r.json())
}

export default function Challenges() {
  const { isLoading, data = [] } = useQuery('challenges', getChallenges)
  return (
    <div>
      Challenges
      {isLoading ? <div>Loading</div> : null}
      {data.map((d) => (
        <Link key={d.id} href={`/challenges/${d.id}`}>
          {d.name}
        </Link>
      ))}
    </div>
  )
}
