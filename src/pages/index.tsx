import { Challenge, User } from '@prisma/client'
import fetch from 'isomorphic-fetch'
import Link from 'next/link'
import { useQuery } from 'react-query'

async function getChallenges(): Promise<(Challenge & { author: User })[]> {
  return fetch('/api/challenges').then((r) => r.json())
}

export default function Index() {
  const { isLoading, data = [] } = useQuery('challenges', getChallenges)
  return (
    <div className="wrapper">
      <div className="flex flex-row">
        <div className="flex-1">
          {data.length} Challenge{data.length === 1 ? '' : 's'}
        </div>
        <Link href="/challenges/edit/new">New</Link>
      </div>
      {isLoading ? <div>Loading</div> : null}
      {data.map((d) => (
        <Link key={d.id} href={`/challenges/${d.id}`}>
          <a>
            <div className="flex flex-row gap-2">
              <span>{d.name}</span>
              <span>{d.steps.length} steps</span>
              <span>{new Date(d.createdAt).toISOString()}</span>
              <span>{d.author.accountData.name}</span>
            </div>
          </a>
        </Link>
      ))}
    </div>
  )
}
