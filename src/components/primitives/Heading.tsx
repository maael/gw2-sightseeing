import { useSession, signIn, signOut } from 'next-auth/react'

export default function Heading() {
  const { data: session } = useSession()
  console.info({ session, user: session?.user, test: session?.user?.accountData?.characters })
  if (session) {
    return (
      <>
        Signed in as {session?.user?.name} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  )
}
