import { useState, Fragment, Children, useRef, useEffect, Ref, useCallback } from 'react';
import { connect } from 'react-redux'
// import { Transition } from '@headlessui/react'
import Layout from '@layouts/DefaultLayout';
import Input from '@modules/Input'
import Select from '@modules/Select'
import MenuIcon from '@modules/MenuIcon'
import { MdOutlinePalette, MdOutlineSmartDisplay, MdOutlineImage } from 'react-icons/md'
import { IoAddCircleOutline } from 'react-icons/io5'
import { TbFileImport } from 'react-icons/tb'
import { AiOutlineFontSize } from 'react-icons/ai'
import { TiEqualsOutline } from 'react-icons/ti'

import { defaultQuestion } from '@components/dashboard/defaults'
import { debounce } from '@helpers'
interface questionParams {
  index: number,
  payload: any
}
type Props = {
  tabIndex?: number,
  question?: any,
  setQuestionIndex: (index: number) => void,
  addQuestion: (index?: number) => void,
  setQuestionValue: ({ index, payload }: questionParams) => void,
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
  return (
    <div
      ref={cardRef}
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
    description: "",
    selectedIndex: -1
  })
  const [questions, setQuestions] = useState([defaultQuestion]);
  const [sidebarY, setSidebarY] = useState(0)
  const handleChange = (e: React.ChangeEvent<any>) => {
    setState((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value }
    })
  }

  const getRect = (curr: HTMLDivElement) => {
    return curr.getBoundingClientRect().y ?? 0
  }
  const layoutRef = useRef<HTMLDivElement>(null)
  const toolbarRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<HTMLDivElement[]>([])
  const inputRefs = useRef<HTMLInputElement[]>([])
  const headerRef = useRef<HTMLDivElement>(null)
  const headerInputRef = useRef<HTMLInputElement>(null)

  const repositionToolbar = useCallback((currY: number) => {
    const { innerHeight } = window;
    const navSize = 105
    const toolbarHeight = toolbarRef.current?.getBoundingClientRect().height ?? 0
    const layoutY = getRect(layoutRef.current as HTMLDivElement) ?? 0
    const topPosition = navSize + 16 - layoutY
    const bottomPosition = (layoutY * -1) + (innerHeight - (toolbarHeight ?? 0) - 16)

    const sidePosition = currY - layoutY

    let finalPos = sidePosition
    if (currY <= navSize) {
      finalPos = topPosition
    } else if (bottomPosition < sidePosition) {
      finalPos = bottomPosition
    }
    setSidebarY(finalPos)
  }, [])
  const handleCardClick = (idx: number) => {
    setState({ ...state, selectedIndex: idx })
  }
  useEffect(() => {
    const getY = () => {
      const curr = state.selectedIndex == -1 ? headerRef.current : cardRefs?.current[state.selectedIndex]
      return getRect(curr as HTMLDivElement)
    }
    if (state.selectedIndex == -1) {
      headerInputRef?.current?.focus()
    } else {
      inputRefs?.current[state.selectedIndex].focus()
    }
    repositionToolbar(getY())
    // scroll behavior
    const onScroll = () => {
      const repositionToolbarDebounced = debounce(repositionToolbar, 50)
      const y = getY()
      repositionToolbarDebounced(y)
    };
    // clean up code
    window.removeEventListener('scroll', onScroll);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [state.selectedIndex, repositionToolbar])

  useEffect(() => {
    cardRefs.current = cardRefs.current.slice(0, questions.length)
    inputRefs.current = inputRefs.current.slice(0, questions.length)
  }, [questions])

  // const handleAdd = () => {
  //   // const { questionIndex } = props.question
  //   // props.addQuestion(questionIndex)
  //   // props.setQuestionIndex(questionIndex + 1)
  //   // setTimeout(() => {
  //   //   repositionToolbar(getRect(cardRef?.current[questionIndex + 1] as HTMLDivElement))
  //   // }, 100)

  //   setArr([2, 3, 4, 5, 1])
  // }

  interface questionParams {
    index: number,
    payload: any
  }
  const setQuestionValue = ({ index, payload }: questionParams) => {
    const temp = [...questions]
    temp[index] = { ...temp[index], ...payload }
    setQuestions(temp)
  }
  const addQuestions = () => {
    const temp = [...questions]
    let selectedIndex
    if (state.selectedIndex != undefined) {
      temp.splice(state.selectedIndex + 1, 0, defaultQuestion)
      selectedIndex = state.selectedIndex + 1
    } else {
      temp.push(defaultQuestion)
      selectedIndex = temp.length - 1
    }
    setQuestions([...temp])
    setState({ ...state, selectedIndex })
  }
  // const duplicateQuestion = () => {
  //   const temp = [...questions]
  //   temp.splice(state.selectedIndex + 1, 0, temp[state.selectedIndex])
  //   setQuestions([...temp])
  //   setState({ ...state, selectedIndex: state.selectedIndex + 1 })
  // }
  // const removeQuestion = (index) => {
  //   const temp = [...questions]
  //   if (temp[index].id != undefined) {
  //     setDeletedQuestionIds([...deletedQuestionIds, temp[index].id])
  //   }
  //   temp.splice(index, 1)
  //   setQuestions([...temp])
  //   setState({ ...state, selectedIndex: index - 1 })
  // }
  const menus = [
    {
      title: "Add question",
      icon: <IoAddCircleOutline />,
      onClick: addQuestions
    },
    {
      title: "Import questions",
      icon: <TbFileImport />,
      onClick: () => console.log(questions)
    },
    {
      title: "Add title and description",
      icon: <AiOutlineFontSize />,
    },
    {
      title: "Add image",
      icon: <MdOutlineImage />,
    },
    {
      title: "Add video",
      icon: <MdOutlineSmartDisplay />,
    },
    {
      title: "Add section",
      icon: <TiEqualsOutline />,
    }
  ]
  return (
    <Layout>
      {props.tabIndex == 0 && (
        <div className='overflow-x-clip'>
          <div
            className='flex justify-center mt-3 overflow-y-visible overflow-x-clip' ref={layoutRef}>
            <div className='sm:w-[770px]' style={{ minHeight: "calc(100vh - 165px)" }}>
              <div>
                <div className='relative hidden form:block'>
                  <Toolbar
                    menus={menus}
                    toolbarRef={toolbarRef}
                    sidebarY={sidebarY}
                  />
                </div>
                <CardContainer
                  cardRef={headerRef}
                  topHeader
                  onClick={() => handleCardClick(-1)}
                  selected={-1 == state.selectedIndex}
                >
                  <div className='py-4 px-6'>
                    <Input
                      inputRef={headerInputRef}
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
                {questions.map((row: any, i: number) =>
                  <CardContainer
                    cardRef={(el: any) => cardRefs.current[i] = el}
                    selected={i == state.selectedIndex}
                    onClick={() => { handleCardClick(i) }}
                    key={i}
                  >
                    <div className='py-4 px-6 flex flex-wrap items-start'>
                      <div className=" flex-grow max-w-full ml-2 mr-1 ">
                        <Input
                          alwaysHighlight
                          inputRef={(el: any) => inputRefs.current[i] = el}
                          containerClass=' bg-gray-100'
                          className=" text-base p-3 bg-gray-100"
                          name="question"
                          value={row.title}
                          onChange={(e) => {
                            setQuestionValue({ index: i, payload: { title: e.target.value } })
                          }}
                          placeholder={`Question ${i + 1}`}
                        />
                      </div>
                      <div className='mx-1 z-0'>
                        <MenuIcon
                          icon={<MdOutlineImage />}
                        />
                      </div>
                      <div className="w-60">
                        <Select />
                      </div>
                    </div>
                  </CardContainer>
                )}
              </div>
            </div>
          </div>
          <BottomToolbar menus={menus} />

        </div>
      )}
    </Layout>
  )
}

interface ToolbarProps {
  menus: any[],
  toolbarRef?: Ref<HTMLDivElement>,
  sidebarY?: number,
};
const BottomToolbar = ({ menus }: ToolbarProps) => {
  return (
    <div className='form:hidden bg-white sticky items-center flex shadow-lg rounded-md z-10 bottom-0 mx-5'>
      {menus.map((row, i) =>
        <div key={i} className='justify-center flex flex-1 '
          onClick={row.bottomOnClick ? row.bottomOnClick : row.onClick}
        >
          <MenuIcon
            orientation="right"
            additionalClass="h-12 w-full m-0"
            title={row.title}
            icon={row.icon}
          />
        </div>
      )}
    </div>
  )
}
const Toolbar = ({ toolbarRef, sidebarY, menus }: ToolbarProps) => {
  return (
    <div
      ref={toolbarRef}
      style={{ top: sidebarY }}
      className='items-center transition-all duration-500 flex flex-col shadow-md bg-white rounded-md absolute z-0 -right-16 px-[2px] py-1'>
      {menus.map((row, i) =>
        <div key={i} className='m-1' onClick={row.onClick}>
          <MenuIcon
            orientation="right"
            additionalClass="w-8 h-8 p-1"
            title={row.title}
            icon={row.icon}
          />
        </div>
      )}
    </div>
  )
}

const mapStateToProps = (state: any) => ({
  tabIndex: state.tab.tabIndex,
})

export default connect(mapStateToProps)(Page)