import { useState, useRef, useEffect, Ref, useCallback } from 'react';
import { connect } from 'react-redux'
import Layout from '@layouts/DefaultLayout';
import Input from '@modules/Input'
import Select from '@modules/Select'
import MenuIcon from '@modules/MenuIcon'
import DropdownButton from '@modules/DropdownButton'
import Toggle from '@modules/Toggle'

import { MdOutlineSmartDisplay, MdOutlineImage, MdContentCopy, } from 'react-icons/md'
import { IoAddCircleOutline, IoEllipsisHorizontalSharp } from 'react-icons/io5'
import { TbFileImport } from 'react-icons/tb'
import { AiOutlineFontSize } from 'react-icons/ai'
import { TiEqualsOutline } from 'react-icons/ti'
import { IconContext } from 'react-icons';
import { IoMdCheckmark } from 'react-icons/io';
import { FiTrash2 } from 'react-icons/fi'
import { BiDotsVerticalRounded } from 'react-icons/bi';

import { defaultQuestion, choicesData, additionalOptionsMap, moreOptionsArr } from '@components/dashboard/defaults'
import { debounce, getLayoutY, swap } from '@helpers'
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
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void,
  handleDragStart?: (e: any) => void,
  selected: boolean,
  currentlyDragged?: boolean,
  cardRef?: Ref<HTMLDivElement>
};
const CardContainer = ({ children, currentlyDragged = false, handleDragStart, cardRef, onClick, containerClass = "", selected = false, topHeader = false, ...props }: ContainerProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  function DoubleEllipsis() {
    return (
      <IconContext.Provider value={{ style: { display: 'flex' } }}>
        <div>
          <IoEllipsisHorizontalSharp size={17} style={{ marginBottom: "-12px", color: "darkgray" }} />
          <IoEllipsisHorizontalSharp size={17} style={{ color: "darkgray" }} />
        </div>
      </IconContext.Provider>
    );
  }
  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={cardRef}
      onClick={onClick}
      style={{
        opacity: currentlyDragged ? 0.5 : 1,
      }}
      className={'bg-white w-full shadow-md rounded-md relative flex flex-col mb-4' + containerClass}
    >
      {topHeader ?
        <div className=' bg-purple-500 flex left-0 absolute rounded-tl-md rounded-tr-md top-0 h-[9px] w-full'></div> :
        <button
          className="absolute top-0 w-full justify-center items-center cursor-move"
          onMouseDown={handleDragStart}
          style={{
            userSelect: "none",
            display: isHovered || selected ? "flex" : "none"
          }}
        >
          {DoubleEllipsis()}
        </button>
      }
      {selected &&
        <div
          className={(topHeader ? "rounded-bl-md" : "rounded-bl-md rounded-tl-md") + ' bg-blue-600 flex left-0 absolute bottom-0 w-[6px]'}
          style={{ height: `calc(100% ${topHeader ? " - 9px" : ""})` }}>
        </div>}
      {children}
    </div >
  )
}

interface Item {
  icon?: JSX.Element
  label: string
  value: string
  group?: number
}

interface DropdownItem {
  onClick: () => void;
  content: Item
}
interface State {
  title: string,
  description: string,
  reposition: boolean,
  minHeight: string,
  divClick: boolean,
  selectedIndex: number | null,
  currentlyDragged: number | null,
  currentSwapIndex: number | null,
  navbarHeight: number
}
interface Question {
  title: string
  type: Item
  answerOptions: any[]
  gridRowOptions: any[]
  gridColumnOptions: any[]
  linearValueOptions: any
  image: string
  previewImage: string
  imageAlignment: string
  moreOptions: object
  [key: string]: any
}
const Page: React.FC<Props> = (props) => {
  const [state, setState] = useState<State>({
    title: "",
    description: "",
    selectedIndex: 0,
    reposition: true,
    minHeight: "100vh",
    divClick: true,
    currentSwapIndex: null,
    currentlyDragged: null,
    navbarHeight: 105
  })
  const [questions, setQuestions] = useState<Question[]>([defaultQuestion]);

  const [sidebarY, setSidebarY] = useState(0)
  const [dragY, setDragY] = useState(0)
  const handleChange = (e: React.ChangeEvent<any>) => {
    setState((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value }
    })
  }
  const handleCardClick = (divClick: boolean, idx: number) => {
    setState({ ...state, selectedIndex: idx, divClick })
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
    const layoutY = getLayoutY(layoutRef.current as HTMLDivElement) ?? 0
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

  const resizeScrollbar = useCallback(() => {
    setHasScrollbar((layoutRef?.current?.getBoundingClientRect().height ?? 0) > (window.innerHeight - state.navbarHeight));
  }, [state.navbarHeight])
  // selected index change
  useEffect(() => {
    if (state.selectedIndex != null) {
      if (state.divClick) {
        if (state.selectedIndex == -1) {
          headerInputRef?.current?.focus()
        } else {
          inputRefs?.current[state.selectedIndex].focus()
        }
      }
      if (state.reposition) {
        const getY = () => {
          if (state.selectedIndex == null)
            return 0

          const curr = state.selectedIndex == -1 ? headerRef.current : cardRefs?.current[state.selectedIndex]
          return getLayoutY(curr as HTMLDivElement)
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
      }
    }
    resizeScrollbar()
  }, [state.selectedIndex, state.reposition, state.divClick, resizeScrollbar, repositionToolbar])

  useEffect(() => {
    cardRefs.current = cardRefs.current.slice(0, questions.length)
    inputRefs.current = inputRefs.current.slice(0, questions.length)
  }, [questions])

  //#region resize behavior
  const [viewportWidth, setViewportWidth] = useState<number | null>(null);

  useEffect(() => {
    resizeScrollbar()
    const handleResize = () => {
      const newViewportWidth = window.innerWidth;
      setViewportWidth(newViewportWidth);
      resizeScrollbar()
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [resizeScrollbar]);

  useEffect(() => {
    const containerMarginTop = 12
    let navbarHeight = 105
    let bottomToolbarHeight = 48
    if (viewportWidth) {
      if (viewportWidth < 640) {
        navbarHeight = 151
      } else if (viewportWidth > 930) {
        bottomToolbarHeight = 0
      }
    }

    setState(prevState => ({
      ...prevState,
      reposition: (viewportWidth ?? 0) > 930,
      navbarHeight,
      minHeight: `calc(100vh - ${navbarHeight + bottomToolbarHeight + containerMarginTop}px)`
    }));
  }, [viewportWidth]);

  const [hasScrollbar, setHasScrollbar] = useState(false);
  //#endregion

  //#region question
  interface questionParams {
    index: number,
    payload: any
  }
  const setQuestionValue = ({ index, payload }: questionParams) => {
    setQuestions(prevState => {
      const temp = [...prevState]
      temp[index] = { ...temp[index], ...payload }
      return temp;
    })
  }
  const addQuestions = () => {
    const temp = [...questions]
    const tempOpt = [...moreOptQuestion]

    let selectedIndex = 0
    if (state.selectedIndex != undefined) {
      tempOpt.splice(state.selectedIndex + 1, 0, defaultQuestion.moreOptions)
      temp.splice(state.selectedIndex + 1, 0, defaultQuestion)
      selectedIndex = state.selectedIndex + 1
    } else {
      tempOpt.push({})
      temp.push(defaultQuestion)
      selectedIndex = temp.length - 1
    }
    setState({ ...state, selectedIndex, divClick: true })
    setQuestions(temp)
    setMoreOptQuestion(tempOpt)
  }
  const duplicateQuestion = (index: number) => {
    const temp = [...questions]
    const tempOpt = [...moreOptQuestion]
    let selectedIndex = index
    if (index != undefined) {
      temp.splice(index + 1, 0, temp[index])
      tempOpt.splice(index + 1, 0, tempOpt[index])
      selectedIndex = index + 1
    }
    setTimeout(() => {
      setState({ ...state, selectedIndex, divClick: true })
      setQuestions(temp)
      setMoreOptQuestion(tempOpt)
    }, 50)
  }
  const removeQuestion = (index: number) => {
    const temp = [...questions]
    const tempOpt = [...moreOptQuestion]
    temp.splice(index, 1)
    tempOpt.splice(index, 1)

    setTimeout(() => {
      setQuestions(temp)
      setMoreOptQuestion(tempOpt)
      setState({ ...state, selectedIndex: index == 0 && questions.length > 1 ? index : index - 1 })
    }, 50)
  }
  //#endregion

  const menus = [
    {
      title: "Add question",
      icon: <IoAddCircleOutline />,
      onClick: addQuestions
    },
    {
      title: "Import questions",
      icon: <TbFileImport />,
      onClick: () => console.log(moreOptQuestion)
    },
    {
      title: "Add title and description",
      icon: <AiOutlineFontSize />,
      onClick: () => console.log(questions)
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

  //#region dragging behavior
  const handleDragEnd = useCallback(() => {
    setState((prevState) => {
      return {
        ...prevState,
        selectedIndex: prevState.currentlyDragged,
        currentlyDragged: null,
        currentSwapIndex: null
      }
    })
  }, [])

  interface Opt {
    [key: string]: boolean;
  }
  const [moreOptQuestion, setMoreOptQuestion] = useState<Opt[]>([]);
  const handleDragging = useCallback((event: any) => {
    const move = (index: number, direction: "up" | "down") => {
      const nextIndex = direction === "up" ? index - 1 : index + 1
      if (nextIndex >= 0 && nextIndex < questions.length && index !== state.currentSwapIndex) {
        const temp = swap([...questions], index, nextIndex)
        const tempOpt = swap([...moreOptQuestion], index, nextIndex)
        setMoreOptQuestion(tempOpt)
        setQuestions(temp)
        setState((prevState) => ({
          ...prevState,
          currentlyDragged: nextIndex,
          currentSwapIndex: index,
        }))
      }
    }
    if (state.currentlyDragged != null && state.currentlyDragged != state.currentSwapIndex) {
      const isLastCard = state.currentlyDragged >= questions.length - 1
      const isFirstCard = state.currentlyDragged === 0
      const yCoordinate = event.clientY
      if (yCoordinate <= 0) {
        return
      }
      if (!isLastCard) {
        const nextY = getLayoutY(cardRefs.current[state.currentlyDragged + 1]) + 12
        if (yCoordinate > nextY) {
          move(state.currentlyDragged, "down")
        }
      }
      if (!isFirstCard) {
        const prevY = getLayoutY(cardRefs.current[state.currentlyDragged - 1]) + 12
        if (yCoordinate < prevY) {
          move(state.currentlyDragged, "up")
        }
      }
      setDragY(yCoordinate - (getLayoutY(layoutRef.current as HTMLDivElement) ?? 0) - 16)
    }
  }, [state.currentlyDragged, questions, moreOptQuestion, setMoreOptQuestion, state.currentSwapIndex])

  useEffect(() => {
    if (state.currentlyDragged != null) {
      window.addEventListener('mouseup', handleDragEnd)
      window.addEventListener('mousemove', handleDragging, { passive: true })
    }
    return () => {
      window.removeEventListener('mouseup', handleDragEnd)
      window.removeEventListener('mousemove', handleDragging)
    }
  }, [state.currentlyDragged, handleDragEnd, handleDragging])

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    if (state.currentlyDragged == null) {
      return;
    }
    const y = event.clientY;
    const windowHeight = window.innerHeight;
    const offset = windowHeight - y;
    const bottomBreakpoint = 150;
    const getScrollSpeed = (yOffset: number) => {
      const scrollSpeed = 20;
      if (yOffset < (bottomBreakpoint / 2)) {
        return 50;
      }
      if (yOffset < scrollSpeed) {
        return 100;
      }
      return scrollSpeed;
    }
    const lastCardRect = getLayoutY(cardRefs.current[questions.length - 1])
    if (y - offset < lastCardRect && offset < bottomBreakpoint) {
      window.scrollTo(0, window.pageYOffset + getScrollSpeed(offset))
    } else if (y < bottomBreakpoint) {
      window.scrollTo(0, window.pageYOffset - getScrollSpeed(y))
    }
  }
  //#endregion

  //#region map more options
  const toggleQuestionOptions = ({ index, payload }: questionParams) => {
    setMoreOptQuestion(prevState => {
      const temp = [...prevState]
      const updatedQuestion = {
        ...(temp[index] || {}),
        [payload]: !(temp[index]?.[payload] ?? false)
      };
      temp[index] = updatedQuestion;
      return temp;
    })
  }
  const handleTypeChange = (event: Item, index: number) => {
    const validOptions = additionalOptionsMap[event.value]

    setQuestionValue({ index, payload: { type: event } })
    setMoreOptQuestion(prevState => {
      const temp = [...prevState]
      temp[index] = validOptions.reduce((acc: any, curr) => {
        acc[curr] = false;
        return acc;
      }, {})
      return temp;
    })
  }
  useEffect(() => {
    if (state.selectedIndex != null && state.selectedIndex >= 0) {
      const curr = moreOptQuestion[state.selectedIndex] ?? {}
      console.log(state.selectedIndex, curr)
      const tempArr: Item[] = []
      moreOptionsArr.forEach((item) => {
        if (curr[item.value] != undefined) {
          tempArr.push({ ...item, icon: curr[item.value] ? <IoMdCheckmark size={24} color="#5f6368" /> : <div className='w-6'></div> })
        }
      })
      const tempGroup: DropdownItem[][] = []
      tempArr.forEach(({ group = 0, ...item }) => {
        const itemObject = {
          onClick: () => toggleQuestionOptions({ index: state.selectedIndex ?? 0, payload: item.value }),
          content: item
        }
        if (!tempGroup[group]) {
          tempGroup[group] = [itemObject];
        } else {
          tempGroup[group].push(itemObject);
        }
      })
      setQuestionValue({ index: state.selectedIndex, payload: { moreOptions: curr, moreOptionsData: tempGroup } })
    }
  }, [moreOptQuestion, state.selectedIndex])
  return (
    <Layout>
      {props.tabIndex == 0 && (
        <>
          <div
            className="flex justify-center mt-3"
            ref={layoutRef}
            style={{
              paddingRight: hasScrollbar ? 8 : 0,
              paddingLeft: hasScrollbar ? 8 : 0
            }}
          >
            <div className='sm:w-[770px] pb-16'
              style={{ minHeight: state.minHeight, cursor: state.currentlyDragged != null ? "move" : "auto" }}
              onMouseMove={handleMouseMove}
            >
              {state.currentlyDragged != null && (
                <div className='relative'>
                  <div
                    style={{ top: dragY }}
                    className='absolute z-20 w-full opacity-50'
                  >
                    <CardContainer selected={true}>
                      <div className='pt-6 pb-2 px-6 flex flex-wrap items-start'>
                        <div className="flex-grow max-w-full ml-2 mr-1">
                          <Input
                            value={questions[state.currentlyDragged].title}
                            containerClass=' bg-gray-100'
                            className=" text-base p-3 bg-gray-100 cursor-move"
                          />
                        </div>
                        <div className='mx-1 cursor-move'>
                          <MenuIcon
                            icon={<MdOutlineImage />}
                          />
                        </div>
                        <div className="w-60">
                          <Select value={questions[state.currentlyDragged].type} />
                        </div>
                      </div>
                    </CardContainer>
                  </div>
                </div>
              )}
              <div className='relative hidden form:block'>
                <Toolbar
                  viewportWidth={viewportWidth ?? 100}
                  menus={menus}
                  toolbarRef={toolbarRef}
                  sidebarY={sidebarY}
                />
              </div>
              <CardContainer
                cardRef={headerRef}
                topHeader
                onClick={(event) => {
                  handleCardClick(event.target instanceof HTMLDivElement, -1)
                }}
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
                  onClick={(event) => {
                    handleCardClick(event.target instanceof HTMLDivElement, i)
                  }}
                  key={i}
                  currentlyDragged={state.currentlyDragged == i}
                  handleDragStart={(event) => {
                    event.preventDefault()
                    setState({ ...state, currentlyDragged: i, selectedIndex: null })
                  }}
                >
                  <div className='pt-6 pb-2 px-6 '>
                    <div className='flex flex-wrap items-start'>
                      <div className="flex-grow w-[300px] max-w-full">
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
                      <div className='mx-3 z-0'>
                        <MenuIcon
                          icon={<MdOutlineImage />}
                        />
                      </div>
                      <div className="w-60">
                        <Select
                          value={row.type}
                          onChange={(e) => {
                            handleTypeChange(e, i)
                          }}
                          cardRef={cardRefs.current[i]}
                          options={choicesData}
                        />
                      </div>
                    </div>
                    <div style={{ display: state.selectedIndex == i ? "flex" : "none" }} className=' justify-end items-center border-t-[1.5px] mt-4 pt-2'>
                      <MenuIcon
                        title="Duplicate"
                        onClick={() => { duplicateQuestion(i) }}
                        additionalClass='mx-[1px]'
                        icon={<MdContentCopy />}
                      />
                      <MenuIcon
                        title="Delete"
                        onClick={() => removeQuestion(i)}
                        additionalClass='mx-[1px]'
                        icon={<FiTrash2 />}
                      />
                      <div className=' border-l-[1.5px] h-8 mx-2'></div>
                      <span className='text-sm ml-2 mr-3'>Required</span>
                      <Toggle
                        value={row.required}
                        handleChange={(checked: boolean) => setQuestionValue({ index: i, payload: { required: checked } })}
                      />
                      {/* <MenuIcon
                        title="More options"
                        additionalClass='mx-[1px]'
                        icon={<BiDotsVerticalRounded />}
                      /> */}
                      <DropdownButton
                        dropdownItemData={row.moreOptionsData ?? []}
                        cardRef={cardRefs?.current[i]}
                        selected={i == state.selectedIndex}
                      />
                    </div>
                  </div>
                </CardContainer>
              )}
            </div>
          </div>
          <BottomToolbar menus={menus} />
        </>
      )
      }
    </Layout >
  )
}

interface ToolbarProps {
  menus: any[],
  toolbarRef?: Ref<HTMLDivElement>,
  sidebarY?: number,
  viewportWidth?: number
}
const BottomToolbar = ({ menus }: ToolbarProps) => {
  return (
    <div className='pr-4 form:hidden bg-white sticky items-center flex shadow-lg rounded-md bottom-0 mx-5'>
      {menus.map((row, i) =>
        <div key={i} className='justify-center flex flex-1'
          onClick={row.bottomOnClick ? row.bottomOnClick : row.onClick}
        >
          <MenuIcon
            orientation="right"
            additionalClass=""
            title={row.title}
            icon={row.icon}
          />
        </div>
      )}
    </div>
  )
}
const Toolbar = ({ toolbarRef, sidebarY, menus, viewportWidth = 100 }: ToolbarProps) => {
  return (
    <div
      ref={toolbarRef}
      style={{ top: sidebarY, zIndex: 1 }}
      className='items-center  transition-all duration-500 flex flex-col shadow-md bg-white rounded-md absolute -right-16 px-[2px] py-1'>
      {menus.map((row, i) =>
        <div key={i} className='m-[6px]' onClick={row.onClick}>
          <MenuIcon
            orientation={
              viewportWidth < 965 ? "left" :
                viewportWidth < 1150 ? "bottom" :
                  "right"
            }
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