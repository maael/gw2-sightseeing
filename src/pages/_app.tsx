import '~/styles/main.css'
import Head from 'next/head'
import { AppProps } from 'next/app'
import { DefaultSeo } from 'next-seo'
import { SessionProvider } from 'next-auth/react'
import useFathom from '~/components/hooks/useFathom'
import SEO from '~/../next-seo.config'
import EmojiFavicon from '~/components/primitives/EmojiFavicon'
import Heading from '~/components/primitives/Heading'

function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  useFathom()
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#fd015d" />
      </Head>
      <DefaultSeo {...SEO} />
      <SessionProvider session={session}>
        <Heading />
        <Component {...pageProps} />
      </SessionProvider>
      <EmojiFavicon emoji="🤖" />
    </>
  )
}

export default App
