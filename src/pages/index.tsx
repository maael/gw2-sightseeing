export default function Index() {
  return (
    <div className="bg-purple-300 text-purple-800 flex justify-center items-center">
      <form action="/api/user/signup" method="POST">
        Signup
        <input type="text" placeholder="API Key..." name="apiKey" />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  )
}
