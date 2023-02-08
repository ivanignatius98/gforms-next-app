import { useState, Fragment } from 'react';
import { connect } from 'react-redux'
import { Transition } from '@headlessui/react'
import Layout from '@layouts/DefaultLayout';
import Input from '@modules/Input'

type Props = {
  tabIndex?: number,
};

const Page: React.FC<Props> = (props) => {
  const [state, setState] = useState({
    title: "",
    description: ""
  })
  const handleChange = (e: React.ChangeEvent<any>) => {
    setState((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value }
    })
  }
  return (
    <Layout>
      <div className='flex justify-center mt-3'>
        <div className=' md:w-[770px]'>
          {props.tabIndex == 0 && (
            <div className='bg-white w-full shadow-sm rounded-md relative flex flex-col py-1'>
              <div className=' bg-blue-600 flex left-0 absolute  rounded-bl-md bottom-0 w-[6px]'style={{height:"calc(100% + -8px)"}}></div>
              <div className=' bg-purple-500 flex left-0 absolute rounded-tl-md rounded-tr-md top-0 h-2 w-full'></div>
              <div className=' py-4 px-6 '>
                <Input
                  containerClass=''
                  className="text-3xl py-2"
                  name="title"
                  value={state.title}
                  onChange={handleChange}
                  placeholder="Form title"
                />
                <Input
                  className="text-sm "
                  name="description"
                  value={state.description}
                  onChange={handleChange}
                  placeholder="Form description"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default connect((state: any) => state.tab)(Page)