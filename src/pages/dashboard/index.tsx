import { useState, Fragment, Children, useRef, useEffect, Ref } from 'react';
import { connect } from 'react-redux'
import { setQuestionIndex, addQuestion } from '@store/question/action'
import { bindActionCreators } from 'redux'
// import { Transition } from '@headlessui/react'
import Layout from '@layouts/DefaultLayout';
import Input from '@modules/Input'
// import Select from '@modules/Select'
import MenuIcon from '@modules/MenuIcon'
import { MdOutlinePalette } from 'react-icons/md'
import { IoAddCircleOutline } from 'react-icons/io5'

type Props = {
  tabIndex?: number,
  question?: any,
  setQuestionIndex: (index: number) => void,
  addQuestion: () => void,
};

interface ContainerProps {
  children?: JSX.Element,
  topHeader?: boolean,
  containerClass?: string,
  onClick: () => void,
  selected: boolean,
  cardRef: Ref<HTMLDivElement>
};
const CardContainer = ({ children, cardRef, onClick, containerClass = "", selected = false, topHeader = false, ...props }: ContainerProps) => {
  // const boxRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={cardRef}
      onClick={onClick}
      className={'bg-white w-full shadow-md rounded-md relative flex flex-col py-1 mb-4 ' + containerClass}
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
  const toolbarRef = useRef<HTMLDivElement>(null)
  const debounce = (func: Function, wait: number) => {
    let timeout: any
    return function (...args: any) {
      let context = func
      let later = () => {
        timeout = null
        func.apply(func, args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
      if (!timeout) func.apply(context, args)
    }
  }

  const repositionToolbar = (currY: number) => {
    const { innerHeight } = window;
    const navSize = 105
    const toolbarHeight = toolbarRef.current?.getBoundingClientRect().height ?? 0
    const layoutY = layoutRef.current?.getBoundingClientRect().y ?? 0
    const topPosition = navSize + 16 - layoutY
    const sidePosition = currY - layoutY
    const bottomPosition = (layoutY * -1) + (innerHeight - (toolbarHeight ?? 0) - 16)

    let finalPos = sidePosition
    if (currY <= navSize) {
      finalPos = topPosition
    } else if (bottomPosition < sidePosition) {
      finalPos = bottomPosition
    }
    setSidebarY(finalPos)
  }

  const handleCardClick = (idx: number) => {
    repositionToolbar(cardRef?.current[idx]?.getBoundingClientRect().y)
    props.setQuestionIndex(idx)

  }

  useEffect(() => {
    const onScroll = () => {
      const repositionToolbarDebounced = debounce(repositionToolbar, 50)
      repositionToolbarDebounced(cardRef?.current[props.question.questionIndex]?.getBoundingClientRect().y)
    };
    // clean up code
    window.removeEventListener('scroll', onScroll);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [props.question.questionIndex]);

  const cardRef = useRef<HTMLDivElement[]>([]);
  useEffect(() => {
    cardRef.current = cardRef.current.slice(0, props.question.questions.length);
  }, [props.question.questions]);

  return (
    <Layout>
      <div className='flex justify-center mt-3' ref={layoutRef}>
        <div className=' md:w-[770px] '>
          {props.tabIndex == 0 && (
            <div className='relative' >
              <CardContainer
                cardRef={(el: any) => cardRef.current[0] = el}
                topHeader
                onClick={() => handleCardClick(0)}
                selected={0 == props.question.questionIndex}
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
              {props.question.questions.map((row: any, idx: any) => {
                return (
                  <CardContainer
                    cardRef={(el: any) => cardRef.current[idx + 1] = el}
                    selected={idx + 1 == props.question.questionIndex}
                    onClick={() => { handleCardClick(idx + 1) }}
                    key={idx + 1}
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
                )
              })}
              <div ref={toolbarRef} style={{ top: sidebarY }} className='items-center transition-all duration-300 flex flex-col shadow-md bg-white rounded-md absolute z-0 -right-16 px-[2px] py-1'>
                <div className='m-1'>
                  <div onClick={props.addQuestion}>
                    <MenuIcon
                      orientation="right"
                      additionalClass="w-8 h-8 p-1"
                      title="Add question"
                      icon={<IoAddCircleOutline />}
                    />
                  </div>
                </div>
                <div className='m-1'>
                  <MenuIcon
                    additionalClass="w-8 h-8 p-1"
                    title="Customize Theme"
                    icon={<MdOutlinePalette />}
                  />
                </div>
                <div className='m-1'>
                  <MenuIcon

                    additionalClass="w-8 h-8 p-1"
                    title="Customize Theme"
                    icon={<MdOutlinePalette />}
                  />
                </div>
                <div className='m-1'>
                  <MenuIcon
                    additionalClass="w-8 h-8 p-1"
                    title="Customize Theme"
                    icon={<MdOutlinePalette />}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout >
  )
}

const mapStateToProps = (state: any) => ({
  tabIndex: state.tab.tabIndex,
  question: state.question,
})
const mapDispatchToProps = (dispatch: any) => {
  return {
    setQuestionIndex: bindActionCreators(setQuestionIndex, dispatch),
    addQuestion: bindActionCreators(addQuestion, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Page)