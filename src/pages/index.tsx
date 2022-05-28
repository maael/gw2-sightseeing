import { Challenge, User } from '@prisma/client'
import fetch from 'isomorphic-fetch'
import Link from 'next/link'
import { useQuery } from 'react-query'
import Parchment from '~/components/primitives/Parchment'
import Scroll from '~/components/primitives/Scroll'

async function getChallenges(): Promise<(Challenge & { author: User })[]> {
  return fetch('/api/challenges').then((r) => r.json())
}

export default function Index() {
  const { isLoading, data = [] } = useQuery('challenges', getChallenges)
  return (
    <div className="wrapper flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row sm:justify-between">
        <Scroll>
          {data.length} Challenge{data.length === 1 ? '' : 's'}
        </Scroll>
        <Link href="/challenges/edit/new">
          <a>
            <Scroll outerClassName="transform hover:hover:-translate-y-1 transition-transform">New Challenge</Scroll>
          </a>
        </Link>
      </div>
      {isLoading ? <Parchment>Loading</Parchment> : null}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {data.map((d) => (
          <Link key={d.id} href={`/challenges/${d.id}`}>
            <a>
              <Parchment className="flex flex-row gap-2">
                <span>{d.name}</span>
                <span>{d.steps.length} steps</span>
                <span>{new Date(d.createdAt).toISOString()}</span>
                <span>{d.author.accountData.name}</span>
              </Parchment>
            </a>
          </Link>
        ))}
      </div>
    </div>
  )
}
