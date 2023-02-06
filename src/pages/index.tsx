import type { NextPage } from 'next'
import Head from 'next/head'
import Dashboard from '@pages/dashboard';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>App</title>
      </Head>
      <Dashboard />
    </>
  )
}

export default Home
