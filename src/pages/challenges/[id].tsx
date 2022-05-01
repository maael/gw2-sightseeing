import { useSession } from 'next-auth/react'
import Image from 'next/image'
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
    <div className="w-full">
      <div className="wrapper">
        {isLoading ? <div>Loading</div> : null}
        {data?.name}
        {isAuthor ? <Link href={`/challenges/edit/${data.id}`}>Edit</Link> : null}
      </div>
      <div className="wrapper-xl">
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-2">
          {data?.steps?.map((step, idx) => (
            <div key={step.id}>
              {idx}. {step.name} - {step.description}
              {step.image ? (
                <div className="aspect-video relative">
                  <Image layout="fill" src={`https://${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_DOMAIN}/${step.image}`} />
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
