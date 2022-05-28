import { useSession, signIn, signOut } from 'next-auth/react'
import { CgKeyhole } from 'react-icons/cg'
import { AiOutlineLogout } from 'react-icons/ai'
import Link from 'next/link'
import ConnectionStatus from '~/components/primitives/ConnectionStatus'
import Scroll from '~/components/primitives/Scroll'
import ConnectionAdventure from './ConnectionAdventure'

export default function Heading() {
  const { data: session } = useSession()
  return (
    <div className="flex flex-col">
      <div
        className="flex flex-col items-center sm:flex-row gap-1 sm:gap-5 wrapper sm:items-start py-2 mb-3 justify-between"
        style={{ flex: 0 }}
      >
        <Scroll outerClassName="text-3xl">
          <Link href="/">
            <a>
              <span className="hidden md:inline-block mr-2">Guild Wars 2 - </span>Sightseeing Logs
            </a>
          </Link>
        </Scroll>
        {session ? (
          <Scroll className="flex flex-row gap-2 items-center justify-center">
            <Link href="/users/me">{session.user?.name}</Link>
            <button onClick={() => signOut()}>
              <AiOutlineLogout />
            </button>
          </Scroll>
        ) : (
          <Scroll>
            <form
              className="flex flex-row gap-2 items-center justify-center"
              onSubmit={(e) => {
                e.preventDefault()
                signIn('gw2-api-key', {
                  apiKey: (e.currentTarget.elements as unknown as { apiKey: { value: string } }).apiKey.value.trim(),
                })
              }}
            >
              <input
                type="text"
                name="apiKey"
                placeholder="API Key..."
                className="bg-transparent border-b-2 placeholder:text-black shadow-transparent"
                style={{ borderColor: '#4E371B' }}
              />
              <button type="submit">
                <CgKeyhole />
              </button>
            </form>
          </Scroll>
        )}
        <ConnectionStatus />
      </div>
      <div className="flex m-auto wrapper">
        <ConnectionAdventure />
      </div>
    </div>
  )
}
