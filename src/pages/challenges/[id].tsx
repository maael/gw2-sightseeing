import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useChallenge } from '~/util/queries'

export default function Challenges() {
  const {
    query: { id },
  } = useRouter()
  const { isLoading, data } = useChallenge(id?.toString())
  const { data: session } = useSession()
  const isAuthor = data && (data.authorId === session?.user.id || session?.user.name === 'Mael.3259')
  return (
    <div className="wrapper">
      {isLoading ? <div>Loading</div> : null}
      {data?.name}
      {isAuthor ? <Link href={`/challenges/edit/${data.id}`}>Edit</Link> : null}
      {data?.steps?.map((step) => (
        <div key={step.id}>
          {step.name} - {step.description}
        </div>
      ))}
    </div>
  )
}
