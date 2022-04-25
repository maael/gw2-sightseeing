import { signIn } from 'next-auth/react'

export default function Index() {
  return (
    <div className="bg-purple-300 text-purple-800 flex justify-center items-center">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          signIn('gw2-api-key', {
            apiKey: (e.currentTarget.elements as unknown as { apiKey: { value: string } }).apiKey.value.trim(),
          })
        }}
      >
        Signup
        <input type="text" placeholder="API Key..." name="apiKey" />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  )
}
