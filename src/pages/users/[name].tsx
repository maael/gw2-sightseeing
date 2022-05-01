import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useUser } from '~/util/queries'

function usePageUser() {
  const { query } = useRouter()
  const isSelf = query.name?.toString() === 'me'
  const { data: session } = useSession()
  let user = session?.user
  const { data } = useUser(isSelf ? undefined : query.name?.toString())
  if (isSelf && data) user = data as any
  const guildMap = new Map(user?.accountData?.guilds?.map((g) => [g.id, g]))
  return { user, guildMap }
}

export default function Account() {
  const { user, guildMap } = usePageUser()
  return (
    <div className="wrapper">
      <div>{user?.name}</div>
      Characters
      {user?.accountData?.characters?.map((char) => (
        <div key={char.name} className="px-2">
          {char.gender} {char.race} {char.class} {char.name}{' '}
          {guildMap.get(char.guild) ? `[${guildMap.get(char.guild)?.tag}]` : ''}
        </div>
      ))}
      Guilds
      {user?.accountData?.guilds?.map((char) => (
        <div key={char.id} className="px-2">
          [{char.tag}] {char.name}
        </div>
      ))}
    </div>
  )
}
