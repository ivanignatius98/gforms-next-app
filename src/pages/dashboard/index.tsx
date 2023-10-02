//#region imports
import { useState, useRef, useEffect, Ref, useCallback, useMemo, RefObject, MutableRefObject, createContext } from 'react';
import { connect } from 'react-redux'
import Layout from '@layouts/DefaultLayout';
import Input from '@modules/Input'
import Select from '@modules/Select'
import MenuIcon from '@modules/MenuIcon'
import Toggle from '@modules/Toggle'
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

import { defaultQuestion } from '@components/dashboard/defaults'
import { classNames, debounce, getLayoutY, swap, getYCoordFromEvent, isTouchEvent } from '@helpers'
import { Question,  SectionItem } from '@interfaces/question.interface';
import DragWrapper from '@modules/Drag';

import { QuestionsContext } from '@context/question.context';
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
  sectionHeader?: JSX.Element | null
};
const CardContainer = ({ children,
  currentlyDragged = false,
  handleDragStart,
  cardRef,
  onClick,
  containerClass = "",
  selected = false,
  topHeader = false,
  sectionHeader = null,
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
  const topleft = !sectionHeader ? "rounded-tl-md" : ""
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
      className={'w-full flex flex-col' + containerClass}
    >
      {sectionHeader}
      <div className='bg-white relative shadow-md rounded-md'>
        {topHeader ?
          <div className={`bg-purple-500 flex left-0 absolute ${topleft} rounded-tr-md top-0 h-[9px] w-full`}></div> :
          (!sectionHeader ? buttonComponent : null) // Render the memoized button component
        }
        {selected &&
          <div
            className={(topHeader ? "rounded-bl-md" : `rounded-bl-md ${topleft}`) + ' bg-blue-600 flex left-0 absolute bottom-0 w-[6px]'}
            style={{ height: `calc(100% ${topHeader ? " - 9px" : ""})` }}>
          </div>}
        {children}
      </div>
    </div>
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

  // const [questions, setQuestions] = useState<Question[]>([defaultQuestion]);
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

  // selected index change
  useEffect(() => {
    const { cardIndex, divClickedOrigin } = cardClick
    if (cardIndex != null) {
      if (divClickedOrigin) {
        if (cardIndex == -1) {
          headerInputRef?.current?.focus()
        } else {
          if (inputRefs?.current[cardIndex]) {
            inputRefs?.current[cardIndex].focus()
          }
        }
      }
    }
  }, [cardClick])

  useEffect(() => {
    cardRefs.current = cardRefs.current.slice(0, questions.length)
    inputRefs.current = inputRefs.current.slice(0, questions.length)
  }, [questions])

  //#region resize behavior

  const [hasScrollbar, setHasScrollbar] = useState(false);
  const handleResize = useCallback(() => {
    const newViewportWidth = window.innerWidth;
    let newNavHeight = 129
    let bottomToolbarHeight = 48
    if (newViewportWidth) {
      if (newViewportWidth < 560) {
        newNavHeight = 147
      } else if (newViewportWidth > hideToolbarBreakpoint) {
        bottomToolbarHeight = 0
      }
    }
    if ((layoutRef?.current?.getBoundingClientRect().height ?? 0) > (window.innerHeight - newNavHeight)) {
      setHasScrollbar(true)
    } else if (hasScrollbar) {
      setHasScrollbar(false)
    }

  }, [hasScrollbar])

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);
  useEffect(() => {
    handleResize()
  }, [questions.length, handleResize])
  //#endregion

  //#region question

  const addQuestions = () => {
    const prevQuestion = questionRef.current
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
    setQuestions(prevQuestion)
  }
  const addSection = () => {
    const prevQuestion = questionRef.current
    const { cardIndex } = { ...cardClick }
    const xid = uuidv4()
    const question = { ...defaultQuestion, xid, type: { value: "section_header", label: "" }, title: "Untitled Section", description: "" }
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

    // where to put sections order
    const extractedData: SectionItem[] = [];

    let sectionIndex = 1
    prevQuestion.forEach((item) => {
      if (item.type.value == "section_header") {
        extractedData.push({
          value: item.title,
          xid: item.xid,
        })
        item.sectionCounter = sectionIndex + 1
        sectionIndex++
      }
    });
    setSections([defaultSection, ...extractedData])
    setQuestions(prevQuestion)
  }
  const duplicateQuestion = () => {
    const prevQuestion = questionRef.current
    const { cardIndex } = { ...cardClick }
    if (cardIndex != undefined) {
      const question = { ...prevQuestion[cardIndex], xid: uuidv4() }
      prevQuestion.splice(cardIndex + 1, 0, question)
      setItemXid(question.xid)
      setCardClick({ cardIndex: cardIndex + 1, divClickedOrigin: true })
    }
    setQuestions(prevQuestion)
  }
  const removeQuestion = () => {
    const prevQuestion = questionRef.current
    const { cardIndex } = { ...cardClick }
    if (cardIndex != null && questions.length > 1) {
      prevQuestion.splice(cardIndex, 1)
      const newIndex = cardIndex == 0 ? cardIndex : cardIndex - 1
      setItemXid(prevQuestion[newIndex].xid)
      setCardClick({ cardIndex: newIndex, divClickedOrigin: true })
    }

    setQuestions(prevQuestion)
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
      onClick: () => console.log(cardClick)
    },
    {
      title: "Add title and description",
      icon: <AiOutlineFontSize />,
      onClick: () => console.log(questions)
    },
    {
      title: "Add image",
      icon: <MdOutlineImage />,
      onClick: () => console.log(questionRef.current)
    },
    {
      title: "Add video",
      icon: <MdOutlineSmartDisplay />,
      onClick: () => console.log(sections)
    },
    {
      title: "Add section",
      icon: <TiEqualsOutline />,
      onClick: addSection
    }
  ]

  //#region dragging behavior
  const handleDragEnd = (endIndex: number) => {
    setCurrentlyDraggedItem(null)
    setCardClick({ cardIndex: endIndex, divClickedOrigin: false })
    setItemXid(questions[endIndex ?? 0].xid)
  }
  const moveQuestions = (index: number, nextIndex: number) => {
    const temp = swap(questionRef.current, index, nextIndex)
    setQuestions(temp)
  }
  //#endregion

  const questionRef = useRef<Question[]>(questions)
  // console.log("RERENDER")
  const handleQuestionChange = (val: Question, index: number) => {
    questionRef.current[index] = val
    if (val.type.value == "section_header") {
      setSections((prevValue) => {
        const idx = prevValue.findIndex(section => section.xid === val.xid)
        prevValue[idx] = { ...prevValue[idx], value: val.title }
        return prevValue
      })
    }
  }

  //#region sections
  const defaultSection = { xid: "fb9cd07f-1b9f-4973-8662-9ad4f49252ee", value: "Form Title" }
  const [sections, setSections] = useState<SectionItem[]>([defaultSection])
  const showSections = sections.length > 1

  const sectionOptions = useMemo(() => {
    const labelContainer = (label: string) => {
      return <div className='px-2'>{label}</div>
    }
    // Transform sections array into desired format
    const mapped = sections.map((section, i) => ({
      value: section.xid,
      label: labelContainer(`Go to section ${i + 1} (${section.value})`),
      group: 0
    }));
    return [
      {
        value: "continue",
        label: labelContainer("Continue to next section"),
        group: 0
      },
      ...mapped,
      {
        value: "submit",
        label: labelContainer("Submit Form"),
        group: 0
      }
    ]
  }, [sections])

  //#endregion
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
                sectionHeader={showSections ? <SectionHat length={sections.length} /> : null}
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
                const isSectionHeader = showSections && row.type.value == "section_header"
                return (
                  <QuestionsContext.Provider
                    key={i}
                    value={{
                      selected,
                      row,
                      i,
                      isSectionHeader
                    }}
                  >
                    <div className='my-4'>
                      <CardContainer
                        cardRef={(el: any) => cardRefs.current[i] = el}
                        selected={selected}
                        onClick={(event) => {
                          if (!selected) {
                            handleCardClick(event.target instanceof HTMLDivElement, i, row.xid)
                          }
                        }}
                        currentlyDragged={currentlyDraggedItem ? row.xid == currentlyDraggedItem.xid : false}
                        handleDragStart={(event) => {
                          if (!isTouchEvent(event)) {
                            event.preventDefault()
                          }
                          setCardClick({ cardIndex: null, divClickedOrigin: false })
                          setCurrentlyDraggedItem({ ...questionRef.current[i], index: i })
                          const eventY = getYCoordFromEvent(event)
                          setDragY(eventY - (getLayoutY(layoutRef.current as HTMLDivElement) ?? 0) - 16)
                        }}
                        sectionHeader={(isSectionHeader) ?
                          <SectionHat length={sections.length} count={row.sectionCounter} />
                          : null
                        }
                      >
                        <QuestionItem
                          textPreview={textPreview}
                          inputRef={(el: any) => inputRefs.current[i] = el}
                          duplicateQuestion={duplicateQuestion}
                          removeQuestion={removeQuestion}
                          cardRefs={cardRefs}
                          onChange={handleQuestionChange}
                          sections={sections}
                        />
                      </CardContainer>
                      {isSectionHeader ?
                        <div className=' h-24 '>
                          <div className="flex text-sm items-center my-2 ">
                            <span className='ml-4'>
                              {`After Section ${row.sectionCounter}`}
                            </span>
                            <div className='w-96'>
                              <Select
                                borderless
                                buttonClass="px-2"
                                value={row.nextSection ?? sectionOptions[0]}
                                onChange={(newValue) => {
                                  setQuestions((prevQ) => {
                                    const prev = [...prevQ]
                                    prev[i].nextSection = newValue
                                    return prev
                                  })
                                }}
                                options={sectionOptions}
                              />
                            </div>
                          </div>
                        </div>
                        : null}
                    </div>
                  </QuestionsContext.Provider>)
              }
              )}
            </div>
          </div>
          <BottomToolbar menus={menus} />
        </>
      )}
    </Layout>
  )
}
const SectionHat = ({ count = 1, length = 1 }) => {
  return (
    <div className='flex rounded-tl-md rounded-tr-md'>
      <div className='text-white text-sm px-4 py-2 bg-purple-500 rounded-t-md'>
        Section {count} of {length}
      </div>
    </div>
  )
}
interface ToolbarProps {
  menus: any[],
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
    <div className='flex justify-center w-full'>
      <div className='pr-4 form:hidden bg-white fixed items-center flex shadow-lg rounded-md bottom-0 mx-5 z-20 w-[95%]' >
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
    </div>
  )
}
const Toolbar = ({
  cardIndex,
  layoutRef,
  headerRef,
  cardRefs,
  menus,
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
  const [toolbarOrientation, setToolbarOrientation] = useState("right")

  return (
    <div
      ref={toolbarRef}
      style={{ top: sidebarY, zIndex: 1 }}
      className='items-center  transition-all duration-300 flex flex-col shadow-md bg-white rounded-md absolute -right-16 px-[2px] py-1'>
      {menus.map((row, i) =>
        <div
          key={i}
          className='m-[6px]'
          onClick={row.onClick}
          onMouseEnter={() => {
            if (window.innerWidth < 965) {
              setToolbarOrientation("left")
            } else if (window.innerWidth < 1150) {
              setToolbarOrientation("bottom")
            } else {
              setToolbarOrientation("right")
            }
          }}>
          <MenuIcon
            orientation={toolbarOrientation}
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