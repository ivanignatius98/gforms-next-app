import { useState, Fragment } from 'react';
import { Transition } from '@headlessui/react'
import Layout from '@layouts/DefaultLayout';
import Input from '@modules/Input'

const Page: React.FC = () => {
  const [isShowing, setIsShowing] = useState(false)
  return (
    <Layout>
      {/* <Input /> */}
    </Layout>
  )
}

export default Page