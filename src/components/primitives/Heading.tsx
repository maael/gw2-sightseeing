import { useSession, signIn, signOut } from 'next-auth/react'
import { CgKeyhole } from 'react-icons/cg'
import { AiOutlineLogout } from 'react-icons/ai'
import Link from 'next/link'

export default function Heading() {
  const { data: session } = useSession()
  return (
    <div className="flex flex-row gap-2 wrapper items-end py-2 mb-3" style={{ flex: 0 }}>
      <div className="flex-1 text-lg">
        <Link href="/">Guild Wars 2 | Observer Notes</Link>
      </div>
      {session ? (
        <div className="flex flex-row gap-2 items-center justify-center">
          <Link href="/users/me">{session.user?.name}</Link>
          <button onClick={() => signOut()}>
            <AiOutlineLogout />
          </button>
        </div>
      ) : (
        <form
          className="flex flex-row gap-2 items-center justify-center"
          onSubmit={(e) => {
            e.preventDefault()
            signIn('gw2-api-key', {
              apiKey: (e.currentTarget.elements as unknown as { apiKey: { value: string } }).apiKey.value.trim(),
            })
          }}
        >
          <input type="text" name="apiKey" />
          <button type="submit">
            <CgKeyhole />
          </button>
        </form>
      )}
    </div>
  )
}
