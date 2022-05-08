import { ChallengeSteps } from '@prisma/client'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import useFound from '~/components/hooks/useFound'
import Parchment from '~/components/primitives/Parchment'
import { useChallenge } from '~/util/queries'

export default function Challenges() {
  const {
    query: { id },
  } = useRouter()
  const { isLoading, data } = useChallenge(id?.toString())
  const { data: session } = useSession()
  const isAuthor = data && (data.authorId === session?.user.id || session?.user.name === 'Mael.3259')
  const foundIds = useFound(data)
  return (
    <div className="w-full flex flex-col gap-5 pb-10">
      <Parchment outerClassName="wrapper" className="flex flex-row">
        {isLoading ? <div>Loading...</div> : null}
        <div className="flex-1">{data?.name}</div>
        {isAuthor ? <Link href={`/challenges/edit/${data.id}`}>Edit</Link> : null}
      </Parchment>
      <div className="wrapper-xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {data?.steps?.map((step) => (
            <ChallengeStep key={step.id} step={step} foundIds={foundIds.map(({ id }) => id)} />
          ))}
        </div>
      </div>
    </div>
  )
}

function ChallengeStep({ step, foundIds }: { step: ChallengeSteps; foundIds: string[] }) {
  const found = foundIds.includes(step.id)
  return (
    <Parchment outerClassName="w-full relative text-center">
      <div className={`flex flex-col gap-2 ${found ? 'opacity-60 grayscale filter' : ''}`}>
        {step.image ? (
          <div className="aspect-video relative rounded-md overflow-hidden rough-outline">
            <Image layout="fill" src={`https://${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_DOMAIN}/${step.image}`} />
          </div>
        ) : null}
        {step.name ? <div>{step.name}</div> : null}
        {step.description ? <div>{step.description}</div> : null}
      </div>
      {found ? (
        <div className="inset-10 absolute flex items-center justify-center">
          <Image src="/images/star.png" layout="fill" objectFit="contain" />
        </div>
      ) : null}
    </Parchment>
  )
}
