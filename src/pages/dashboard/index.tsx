import { useState, Fragment, Children, useRef } from 'react';
import { connect } from 'react-redux'
import { setQuestionIndex } from '@store/question/action'
import { bindActionCreators } from 'redux'
import { Transition } from '@headlessui/react'
import Layout from '@layouts/DefaultLayout';
import Input from '@modules/Input'
import Select from '@modules/Select'
import MenuIcon from '@modules/MenuIcon'
import { MdOutlinePalette, MdOutlineRemoveRedEye, MdFolderOpen, MdStarOutline, MdContentCopy, MdOutlineInsertLink, MdPrint, MdGroupAdd, MdCode } from 'react-icons/md'

type Props = {
  tabIndex?: number,
  questionIndex?: number,
  setQuestionIndex: (idx: number) => void
};

interface ContainerProps {
  idx: number,
  children?: JSX.Element,
  topHeader?: boolean,
  containerClass?: string,
  handleReposition: (y: number) => void,
  selected: boolean
};
const CardContainer = ({ children, handleReposition, containerClass = "", selected = false, topHeader = false, idx, ...props }: ContainerProps) => {
  const boxRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={boxRef} key={idx} onClick={() => { handleReposition(boxRef.current?.getBoundingClientRect().y ?? 0) }}
      className={'bg-white w-full shadow-sm rounded-md relative flex flex-col py-1 ' + containerClass}
    >
      {topHeader && <div className=' bg-purple-500 flex left-0 absolute rounded-tl-md rounded-tr-md top-0 h-2 w-full'></div>}
      {selected && <div className={(topHeader ? "rounded-bl-md " : "rounded-bl-md rounded-tl-md ") + ' bg-blue-600 flex left-0 absolute bottom-0 w-[6px]'} style={{ height: `calc(100% ${topHeader ? "+ -8px" : ""})` }}></div>}
      {children}
    </div>)
}
const Page: React.FC<Props> = (props) => {
  const [state, setState] = useState({
    title: "",
    description: ""
  })
  const [sidebarY, setSidebarY] = useState(0)
  const handleChange = (e: React.ChangeEvent<any>) => {
    setState((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value }
    })
  }

  const layoutRef = useRef<HTMLDivElement>(null)
  const handleReposition = (currY: number, idx: number) => {
    const layoutY = layoutRef.current?.getBoundingClientRect().y ?? 0
    setSidebarY(currY - layoutY)
    props.setQuestionIndex(idx)
  }

  return (
    <Layout>
      <div className='flex justify-center mt-3' ref={layoutRef}>
        <div className=' md:w-[770px] '>
          {props.tabIndex == 0 && (
            <div className='relative' >
              <CardContainer
                topHeader
                containerClass='mb-5'
                handleReposition={(y: number) => handleReposition(y, -1)}
                idx={-1}
                selected={-1 == props.questionIndex}
              >
                <div className='py-4 px-6'>
                  <Input
                    className="text-3xl pb-1"
                    name="title"
                    value={state.title}
                    onChange={handleChange}
                    placeholder="Form title"
                  />
                  <Input
                    containerClass='my-1'
                    className="text-sm"
                    name="description"
                    value={state.description}
                    onChange={handleChange}
                    placeholder="Form description"
                  />
                </div>
              </CardContainer>
              <CardContainer
                selected={0 == props.questionIndex}
                handleReposition={(y: number) => handleReposition(y, 0)}
                idx={0}
              >
                <div className=' py-4 px-6 '>
                  <Input
                    containerClass=''
                    className="text-3xl pb-1"
                    name="title"
                    value={state.title}
                    onChange={handleChange}
                    placeholder="Form title"
                  />
                  <Input
                    containerClass='my-1'
                    className="text-sm "
                    name="description"
                    value={state.description}
                    onChange={handleChange}
                    placeholder="Form description"
                  />
                </div>
              </CardContainer>

              <div style={{ top: sidebarY }} className=' transition-all duration-300 flex flex-col ring-2 bg-white rounded-md absolute z-0 -right-16  py-1'>
                <div className='p-1 m-1'>
                  <MenuIcon
                    smallContainer
                    title="Customize Theme"
                    icon={<MdOutlinePalette />}
                  />
                </div>
                <div className='p-1 m-1'>
                  <MenuIcon
                    smallContainer
                    title="Customize Theme"
                    icon={<MdOutlinePalette />}
                  />
                </div>
                <div className='p-1 m-1'>
                  <MenuIcon
                    smallContainer
                    title="Customize Theme"
                    icon={<MdOutlinePalette />}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

const mapStateToProps = (state: any) => ({
  tabIndex: state.tab.tabIndex,
  questionIndex: state.question.questionIndex,
})
const mapDispatchToProps = (dispatch: any) => {
  return { setQuestionIndex: bindActionCreators(setQuestionIndex, dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(Page)