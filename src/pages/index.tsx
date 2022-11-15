import type { NextPage } from 'next'
import Head from 'next/head'
import Navbar from '@modules/Navbar';
import Layout from '@layouts/DefaultLayout';
import About from '@pages/about';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>App</title>
      </Head>
      <Layout>
        <About />
      </Layout>
    </>
  )
}

export default Home
