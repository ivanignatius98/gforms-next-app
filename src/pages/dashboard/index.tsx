//#region imports
import { useState, useRef, useEffect, Ref, useCallback, useMemo, RefObject, MutableRefObject } from 'react';
import { connect } from 'react-redux'
import Layout from '@layouts/DefaultLayout';
import Input from '@modules/Input'
import Select from '@modules/Select'
import MenuIcon from '@modules/MenuIcon'
import DropdownButton from '@modules/DropdownButton'
import Toggle from '@modules/Toggle'
import AnswerOptions from '@components/dashboard/answerOptions'
import QuestionItem from '@components/dashboard/questionItem'
import { v4 as uuidv4 } from 'uuid';

import { MdOutlineSmartDisplay, MdOutlineImage, MdContentCopy, } from 'react-icons/md'
import { IoAddCircleOutline, IoEllipsisHorizontalSharp } from 'react-icons/io5'
import { TbFileImport } from 'react-icons/tb'
import { AiOutlineFontSize } from 'react-icons/ai'
import { TiEqualsOutline } from 'react-icons/ti'
import { IconContext } from 'react-icons';
import { FiTrash2 } from 'react-icons/fi'
import { BiDotsVerticalRounded } from 'react-icons/bi';

import { defaultQuestion, choicesData, additionalOptionsMap, moreOptionsArr } from '@components/dashboard/defaults'
import { classNames, debounce, getLayoutY, swap, getYCoordFromEvent, isTouchEvent } from '@helpers'
import { DropdownItemsList, Item, Content, ListItem } from '@interfaces/dropdown.interface';
import { Question, OptionChoices } from '@interfaces/question.interface';
import DragWrapper from '@modules/Drag';
// #endregion

//#region card content
type Props = {
  tabIndex?: number
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
const CardContainer = ({ children,
  currentlyDragged = false,
  handleDragStart,
  cardRef,
  onClick,
  containerClass = "",
  selected = false,
  topHeader = false,
  ...props
}: ContainerProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  // Use useMemo to create a memoized version of the button component
  const buttonComponent = useMemo(() => {
    return (
      <button
        className={classNames(
          selected || isHovered ? "flex" : "hidden",
          "absolute top-0 w-full justify-center items-center cursor-move"
        )}
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
        style={{
          userSelect: "none",
        }}
      >
        <IconContext.Provider value={{ style: { display: 'flex' } }}>
          <div>
            <IoEllipsisHorizontalSharp size={17} style={{ marginBottom: "-12px", color: "darkgray" }} />
            <IoEllipsisHorizontalSharp size={17} style={{ color: "darkgray" }} />
          </div>
        </IconContext.Provider>
      </button>
    );
  }, [isHovered, handleDragStart, selected]);

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={cardRef}
      onClick={onClick}
      style={{
        opacity: currentlyDragged ? 0 : 1,
        ...(currentlyDragged ? { height: selected ? 200 : 100 } : {})
      }}
      className={'bg-white w-full shadow-md rounded-md relative flex flex-col mb-4' + containerClass}
    >
      {topHeader ?
        <div className='bg-purple-500 flex left-0 absolute rounded-tl-md rounded-tr-md top-0 h-[9px] w-full'></div> :
        buttonComponent // Render the memoized button component
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
//#endregion

interface State {
  title: string,
  description: string,
  minHeight: string,
}
interface ClickState {
  cardIndex: number | null
  divClickedOrigin: boolean
}
const hideToolbarBreakpoint = 930 //px
const Page: React.FC<Props> = (props) => {
  const [state, setState] = useState<State>({
    title: "",
    description: "",
    minHeight: "100vh",
  })

  const [questions, setQuestions] = useState<Question[]>([defaultQuestion]);
  const [cardClick, setCardClick] = useState<ClickState>({
    cardIndex: 0,
    divClickedOrigin: true
  });

  const [itemXid, setItemXid] = useState<string | null | undefined>(null)
  const [currentlyDraggedItem, setCurrentlyDraggedItem] = useState<Question | null>(null)
  const [dragY, setDragY] = useState(0)
  const handleChange = (e: React.ChangeEvent<any>) => {
    setState((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value }
    })
  }
  const handleCardClick = (divClick: boolean, idx: number, itemXid?: string) => {
    setCardClick({ cardIndex: idx, divClickedOrigin: divClick })
    setItemXid(itemXid)
  }

  const layoutRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<HTMLDivElement[]>([])
  const inputRefs = useRef<HTMLInputElement[]>([])
  const headerRef = useRef<HTMLDivElement>(null)
  const headerInputRef = useRef<HTMLInputElement>(null)

  const [viewportWidth, setViewportWidth] = useState<number | null>(null);
  // selected index change
  useEffect(() => {
    const { cardIndex, divClickedOrigin } = cardClick
    if (cardIndex != null) {
      if (divClickedOrigin) {
        if (cardIndex == -1) {
          headerInputRef?.current?.focus()
        } else {
          inputRefs?.current[cardIndex].focus()
        }
      }
    }
  }, [cardClick])

  useEffect(() => {
    cardRefs.current = cardRefs.current.slice(0, questions.length)
    inputRefs.current = inputRefs.current.slice(0, questions.length)
  }, [questions])

  //#region resize behavior
  useEffect(() => {
    const handleResize = () => {
      const newViewportWidth = window.innerWidth;
      setViewportWidth(newViewportWidth);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const containerMarginTop = 12
    let newNavHeight = 129
    let bottomToolbarHeight = 48
    if (viewportWidth) {
      if (viewportWidth < 640) {
        newNavHeight = 147
      } else if (viewportWidth > hideToolbarBreakpoint) {
        bottomToolbarHeight = 0
      }
    }

    setHasScrollbar((layoutRef?.current?.getBoundingClientRect().height ?? 0) > (window.innerHeight - newNavHeight))
    setState(prevState => ({
      ...prevState,
      minHeight: `calc(100vh - ${newNavHeight + bottomToolbarHeight + containerMarginTop}px)`
    }));
  }, [viewportWidth]);

  const [hasScrollbar, setHasScrollbar] = useState(false);
  //#endregion

  //#region question

  const questionFormValue = useRef<Question[]>(null)
  const setQuestionValue = (payload: any, index: number) => {
    setQuestions(prevState => {
      const temp = [...prevState]
      temp[index] = { ...temp[index], ...payload }
      return temp;
    })
  }
  const addQuestions = () => {
    setQuestions((prevQuestion) => {
      const { cardIndex } = { ...cardClick }
      const question = { ...defaultQuestion, xid: uuidv4() }
      let newIdx = 0
      if (cardIndex != undefined) {
        prevQuestion.splice(cardIndex + 1, 0, question)
        newIdx = cardIndex + 1
      } else {
        prevQuestion.push(question)
        newIdx = prevQuestion.length - 1
      }
      setCardClick({ cardIndex: newIdx, divClickedOrigin: true })
      setItemXid(question.xid)
      return [...prevQuestion]
    })
  }
  const duplicateQuestion = () => {
    setQuestions((prevQuestion) => {
      const { cardIndex } = { ...cardClick }
      let newIdx = cardIndex
      if (cardIndex != undefined) {
        const question = { ...prevQuestion[cardIndex], xid: uuidv4() }
        prevQuestion.splice(cardIndex + 1, 0, question)
        setItemXid(question.xid)
        newIdx = cardIndex + 1
      }
      setCardClick({ cardIndex: newIdx, divClickedOrigin: true })

      return [...prevQuestion]
    })
  }
  const removeQuestion = () => {
    setQuestions((prevQuestion) => {
      const { cardIndex } = { ...cardClick }
      if (cardIndex != null && questions.length > 1) {
        prevQuestion.splice(cardIndex, 1)

        const newIndex = cardIndex == 0 ? cardIndex : cardIndex - 1
        setItemXid(prevQuestion[newIndex].xid)
        setCardClick({ cardIndex: newIndex, divClickedOrigin: true })
      }
      return [...prevQuestion]
    })
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
      onClick: () => console.log(questions)
    },
    {
      title: "Add title and description",
      icon: <AiOutlineFontSize />,
      onClick: () => console.log(itemXid)
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
  const handleDragEnd = (endIndex: number) => {
    setCurrentlyDraggedItem(null)
    setCardClick({ cardIndex: endIndex, divClickedOrigin: false })
    setItemXid(questions[endIndex ?? 0].xid)
  }
  const moveQuestions = (index: number, nextIndex: number) => {
    const temp = swap([...questions], index, nextIndex)
    setQuestions(temp)
  }
  //#endregion
  console.log("RERENDER")
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
            <div className='min-w-[300px] sm:w-[770px] pb-16'
              style={{
                minHeight: state.minHeight,
                cursor: currentlyDraggedItem != null ? "move" : "auto"
              }}
            >
              {currentlyDraggedItem != null && (
                <DragWrapper
                  layoutRef={layoutRef}
                  cardRefs={cardRefs}
                  draggedItem={currentlyDraggedItem}
                  y={dragY}
                  onDragEnd={handleDragEnd}
                  move={moveQuestions}
                >
                  <CardContainer selected={currentlyDraggedItem.xid == itemXid} >
                    <div className='pt-6 pb-2 px-6 '>
                      <div className='flex flex-wrap items-start'>
                        <div className="flex-grow max-w-full ml-2 mr-1">
                          <Input
                            value={currentlyDraggedItem.title}
                            containerClass=' bg-gray-100'
                            className="text-base p-3 bg-gray-100 cursor-move"
                            placeholder="Question"
                          />
                        </div>
                        <div className='mx-1 cursor-move'>
                          <MenuIcon icon={<MdOutlineImage />} />
                        </div>
                        <div className="w-60">
                          <Select value={currentlyDraggedItem.type} />
                        </div>
                      </div>
                      <div className='flex justify-center items-center h-12'>
                        <IoEllipsisHorizontalSharp size={18} style={{ color: "darkgray" }} />
                      </div>
                      <div className={classNames(currentlyDraggedItem.xid == itemXid ? "flex" : "hidden", 'flex justify-end items-center border-t-[1.5px] pt-2')}>
                        <MenuIcon
                          additionalClass='mx-[1px]'
                          icon={<MdContentCopy />}
                        />
                        <MenuIcon
                          additionalClass='mx-[1px]'
                          icon={<FiTrash2 />}
                        />
                        <div className='border-l-[1.5px] h-8 mx-2'></div>
                        <span className='text-sm ml-2 mr-3'>Required</span>
                        <Toggle
                          handleChange={() => { }}
                          value={currentlyDraggedItem.required}
                        />
                        <button className="w-12 h-12 flex items-center justify-center hover:bg-slate-100 active:bg-slate-200 rounded-full">
                          <BiDotsVerticalRounded size={24} color="#5f6368" />
                        </button>
                      </div>
                    </div>
                  </CardContainer>
                </DragWrapper>
              )}
              <div className='relative hidden form:block'>
                <Toolbar
                  currentlyDragging={currentlyDraggedItem != null}
                  viewportWidth={viewportWidth ?? 100}
                  menus={menus}
                  cardIndex={cardClick.cardIndex}
                  layoutRef={layoutRef}
                  cardRefs={cardRefs}
                  headerRef={headerRef}
                />
              </div>
              <CardContainer
                cardRef={headerRef}
                topHeader
                onClick={(event) => {
                  handleCardClick(event.target instanceof HTMLDivElement, -1)
                }}
                selected={-1 == cardClick.cardIndex}
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
              {questions.map((row: Question, i: number) => {
                const selected = cardClick.cardIndex != -1 && itemXid == row.xid
                const textPreview = row.required || row.title === ""
                return (
                  <CardContainer
                    cardRef={(el: any) => cardRefs.current[i] = el}
                    selected={selected}
                    onClick={(event) => {
                      if (!selected) {
                        handleCardClick(event.target instanceof HTMLDivElement, i, row.xid)
                      }
                    }}
                    key={i}
                    currentlyDragged={currentlyDraggedItem ? row.xid == currentlyDraggedItem.xid : false}
                    handleDragStart={(event) => {
                      if (!isTouchEvent(event)) {
                        event.preventDefault()
                      }
                      setCardClick({ cardIndex: null, divClickedOrigin: false })
                      setCurrentlyDraggedItem({ ...row, index: i })
                      const eventY = getYCoordFromEvent(event)
                      setDragY(eventY - (getLayoutY(layoutRef.current as HTMLDivElement) ?? 0) - 16)
                    }}
                  >
                    <QuestionItem
                      selected={selected}
                      textPreview={textPreview}
                      inputRef={(el: any) => inputRefs.current[i] = el}
                      i={i}
                      row={row}
                      setQuestionValue={setQuestionValue}
                      duplicateQuestion={duplicateQuestion}
                      removeQuestion={removeQuestion}
                      cardRefs={cardRefs}
                    />
                  </CardContainer>)
              }
              )}
            </div>
          </div>
          <BottomToolbar menus={menus} />
        </>
      )
      }
    </Layout>
  )
}

interface ToolbarProps {
  menus: any[],
  viewportWidth?: number
  cardIndex: number | null
  layoutRef: RefObject<HTMLDivElement> | null
  headerRef: RefObject<HTMLDivElement> | null
  cardRefs: MutableRefObject<HTMLDivElement[]> | null
  currentlyDragging: boolean
}
interface MenuProps {
  menus: any[]
}
const BottomToolbar = ({ menus }: MenuProps) => {
  return (
    <div className='pr-4 form:hidden bg-white sticky items-center flex shadow-lg rounded-md bottom-0 mx-5 z-20'>
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
const Toolbar = ({
  cardIndex,
  layoutRef,
  headerRef,
  cardRefs,
  menus,
  viewportWidth = 100,
  currentlyDragging = false
}: ToolbarProps) => {
  const toolbarRef = useRef<HTMLDivElement>(null)
  const [sidebarY, setSidebarY] = useState(0)
  const repositionToolbar = useCallback((currY: number, scrollOrigin?: boolean) => {
    if (layoutRef && (!currentlyDragging || scrollOrigin)) {
      const { innerHeight } = window;
      const navSize = 105
      const toolbarHeight = toolbarRef.current?.getBoundingClientRect().height ?? 0
      const layoutY = layoutRef.current ? getLayoutY(layoutRef.current) : 0
      const topPosition = navSize + 40 - layoutY
      const bottomPosition = (layoutY * -1) + (innerHeight - (toolbarHeight ?? 0) - 16)
      const sidePosition = currY - layoutY

      let finalPos = sidePosition
      if (currY <= navSize) {
        finalPos = topPosition
      } else if (bottomPosition < sidePosition) {
        finalPos = bottomPosition
      }
      setSidebarY(finalPos)
    }
  }, [layoutRef, currentlyDragging, toolbarRef])

  const getY = () => {
    if (cardIndex == null || !headerRef || !cardRefs)
      return 0
    const curr = cardIndex == -1 ? headerRef?.current : cardRefs?.current[cardIndex]
    return getLayoutY(curr)
  }

  useEffect(() => {
    repositionToolbar(getY())

    // scroll behavior
    const onScroll = () => {
      const repositionToolbarDebounced = debounce(repositionToolbar, 150)
      const y = getY()
      repositionToolbarDebounced(y, true)
    };
    // clean up code
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [cardIndex])

  return (
    <div
      ref={toolbarRef}
      style={{ top: sidebarY, zIndex: 1 }}
      className='items-center  transition-all duration-300 flex flex-col shadow-md bg-white rounded-md absolute -right-16 px-[2px] py-1'>
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
            smallContainer
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