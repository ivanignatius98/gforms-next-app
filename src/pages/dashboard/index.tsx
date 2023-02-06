import { useState, Fragment } from 'react';
import { Transition } from '@headlessui/react'
import Layout from '@layouts/DefaultLayout';
import Input from '@modules/Input'

const Page: React.FC = () => {
  const [isShowing, setIsShowing] = useState(false)
  const [title, setTitle] = useState("")

  const handleTitleChange = (e: React.ChangeEvent<any>) => {
    setTitle(e.target.value)
  }
  return (
    <Layout>
      <div className='flex justify-center mt-3'>
        <div className='bg-white w-full md:w-[770px]'>
        <Input value={title} onChange={handleTitleChange} />
        <Input value={title} onChange={handleTitleChange} />
        </div>
      </div>
    </Layout>
  )
}

export default Page