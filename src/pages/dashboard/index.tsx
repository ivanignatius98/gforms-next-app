//#region imports
import { useState, useRef, useEffect, Ref, useCallback } from 'react';
import { connect } from 'react-redux'
import Layout from '@layouts/DefaultLayout';
import Input from '@modules/Input'
import Select from '@modules/Select'
import MenuIcon from '@modules/MenuIcon'
import DropdownButton from '@modules/DropdownButton'
import Toggle from '@modules/Toggle'
import AnswerOptions from '@components/dashboard/answerOptions'
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
import { classNames, debounce, getLayoutY, swap } from '@helpers'
import { DropdownItemsList, Item, Content, ListItem } from '@interfaces/dropdown.interface';
import { Question, OptionChoices } from '@interfaces/question.interface';
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
        <div className=' bg-purple-500 flex left-0 absolute rounded-tl-md rounded-tr-md top-0 h-[9px] w-full'></div> :
        <button
          className="absolute top-0 w-full justify-center items-center cursor-move"
          onMouseDown={handleDragStart}
          style={{
            userSelect: "none",
            display: isHovered || selected ? "flex" : "none"
          }}
        >
          <IconContext.Provider value={{ style: { display: 'flex' } }}>
            <div>
              <IoEllipsisHorizontalSharp size={17} style={{ marginBottom: "-12px", color: "darkgray" }} />
              <IoEllipsisHorizontalSharp size={17} style={{ color: "darkgray" }} />
            </div>
          </IconContext.Provider>
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

  const [itemXid, setItemXid] = useState(questions[0].xid)
  const [currentlyDraggedItem, setCurrentlyDraggedItem] = useState<Question | null>(null)
  const [sidebarY, setSidebarY] = useState(0)
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
      if ((viewportWidth ?? 0) > hideToolbarBreakpoint) {
        const getY = () => {
          if (cardIndex == null)
            return 0
          const curr = cardIndex == -1 ? headerRef.current : cardRefs?.current[cardIndex]
          return getLayoutY(curr as HTMLDivElement)
        }
        setTimeout(() => repositionToolbar(getY()), 0)
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
  }, [cardClick, repositionToolbar])

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
  interface dragProp {
    current: number | null
    prev: number | null
    isFirstCard: boolean | null
    isLastCard: boolean | null
  }
  const defaultDragState = {
    current: null,
    prev: null,
    isFirstCard: null,
    isLastCard: null
  }
  const [drag, setDrag] = useState<dragProp>(defaultDragState)
  const handleDragEnd = useCallback(() => {
    setDrag((prevDrag) => {
      setCardClick({ cardIndex: prevDrag.current, divClickedOrigin: false })
      setItemXid(questions[prevDrag.current ?? 0].xid)
      return defaultDragState
    })
  }, [questions])
  const handleDragChange = (nextIndex: number, index: number | null) => {
    setDrag(() => {
      const dragCurrent = nextIndex
      const isLastCard = dragCurrent >= questions.length - 1
      const isFirstCard = dragCurrent === 0
      return {
        current: nextIndex,
        prev: index,
        isLastCard,
        isFirstCard
      }
    })
  }
  const handleDragging = useCallback((event: any) => {
    const move = (index: number, direction: "up" | "down") => {
      const nextIndex = direction === "up" ? index - 1 : index + 1
      if (nextIndex >= 0 && nextIndex < questions.length && index !== drag.prev) {
        const temp = swap([...questions], index, nextIndex)
        setQuestions(temp)
        handleDragChange(nextIndex, index)
      }
    }

    if (drag.current == null || drag.current == drag.prev) {
      return
    }

    const yCoordinate = event.clientY
    if (yCoordinate <= 0) {
      return
    }
    if (!drag.isLastCard) {
      const nextY = getLayoutY(cardRefs.current[drag.current + 1]) + 12
      if (yCoordinate > nextY) {
        move(drag.current, "down")
      }
    }
    if (!drag.isFirstCard) {
      const prevY = getLayoutY(cardRefs.current[drag.current - 1]) + 12
      if (yCoordinate < prevY) {
        move(drag.current, "up")
      }
    }
    setDragY(yCoordinate - (getLayoutY(layoutRef.current as HTMLDivElement) ?? 0) - 16)
  }, [drag, questions])

  useEffect(() => {
    if (drag.current != null) {
      window.addEventListener('mouseup', handleDragEnd)
      window.addEventListener('mousemove', handleDragging)
    }
    return () => {
      window.removeEventListener('mouseup', handleDragEnd)
      window.removeEventListener('mousemove', handleDragging)
    }
  }, [drag, handleDragEnd, handleDragging])

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    if (drag.current == null) {
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
  interface contents {
    content: Item
  }
  interface SelectItems {
    header?: string
    items: contents[]
  }

  const handleTypeChange = (event: Item, index: number) => {
    if (index != null && index >= 0) {
      const validOptions = additionalOptionsMap[event.value]
      const tempArr: Item[] = moreOptionsArr.filter((item) => validOptions.includes(item.value));
      const tempGroup: SelectItems[] = []
      let optionsHeight = 8 + (tempArr[0]?.group == 0 ? 20 : 0)
      let groupCount = 1
      let prevGroup = 0
      tempArr.forEach(({ group = 0, ...item }) => {
        const itemObject = {
          content: item
        }
        if (!tempGroup[group]) {
          tempGroup[group] = {
            items: [itemObject],
            header: group == 0 ? "Show" : ""
          }
        } else {
          tempGroup[group].items.push(itemObject)
        }
        if (prevGroup != group) {
          groupCount++
          prevGroup = group
        }
        optionsHeight += 44
      })
      optionsHeight += (groupCount * 16)

      setQuestionValue({
        moreOptionValues: [],
        type: event,
        moreOptionsData: {
          items: tempGroup,
          optionsHeight
        }
      }, index)
    }
  }
  // #endregion

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
              style={{ minHeight: state.minHeight, cursor: drag.current != null ? "move" : "auto" }}
              onMouseMove={handleMouseMove}
            >
              {drag.current != null && currentlyDraggedItem != null && (
                <div className='relative'>
                  <div
                    style={{ top: dragY }}
                    className='absolute z-20 w-full opacity-50 transition-all duration-[5ms]'
                  >
                    <CardContainer selected={currentlyDraggedItem.xid == itemXid}>
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
                        <div className={classNames(drag.current == cardClick.cardIndex ? "flex" : "hidden", 'flex justify-end items-center border-t-[1.5px] pt-2')}>
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
                // const selected = i == cardClick.cardIndex
                const selected = itemXid == row.xid
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
                    currentlyDragged={drag.current == i}
                    handleDragStart={(event) => {
                      event.preventDefault()
                      setCardClick({ cardIndex: null, divClickedOrigin: false })
                      handleDragChange(i, null)
                      setCurrentlyDraggedItem(row)
                      setDragY(event.clientY - (getLayoutY(layoutRef.current as HTMLDivElement) ?? 0) - 16)
                    }}
                  >
                    <div className={classNames(selected ? "p-6 pb-2" : "p-6")}>
                      <div className='flex flex-wrap items-start'>
                        <div className={classNames(textPreview && !selected ? "hidden" : "flex-grow w-[300px] max-w-full")}>
                          <Input
                            alwaysHighlight
                            inputRef={(el: any) => inputRefs.current[i] = el}
                            showFooter={selected}
                            containerClass={classNames(selected ? "bg-gray-100" : "bg-none mb-[2px]")}
                            className={classNames(selected ? "p-3" : "", "bg-inherit text-base")}
                            name="question"
                            value={row.title}
                            onChange={(e) => setQuestionValue({ title: e.target.value }, i)}
                            placeholder="Question"
                          />
                        </div>
                        {textPreview && !selected && (
                          <div className='my-[2px] mb-1 flex'>
                            <div className='text-base'>{row.title || "Question"}</div>
                            {row.required && <div className='ml-1 text-red-500'>*</div>}
                          </div>
                        )}
                        {selected && (
                          <>
                            <div className='mx-3 z-0'>
                              <MenuIcon icon={<MdOutlineImage />} />
                            </div>
                            <div className="w-60">
                              <Select
                                value={row.type}
                                onChange={(newValue) => { handleTypeChange(newValue, i) }}
                                options={choicesData}
                              />
                            </div>
                          </>
                        )}
                      </div>
                      {/* Description */}
                      {row.moreOptionValues?.includes("description") &&
                        <Input
                          alwaysHighlight
                          showFooter={selected}
                          containerClass="bg-none my-2"
                          className="bg-inherit text-sm"
                          name="description"
                          value={row.description}
                          onChange={(e) => setQuestionValue({ description: e.target.value }, i)}
                          placeholder={`Description`}
                        />
                      }
                      {/* Content */}
                      <AnswerOptions
                        selected={selected}
                        questionProps={row}
                        optionsValue={row.answerOptions}
                        setOptionsValue={(newValue: OptionChoices[]) => {
                          setQuestionValue({ answerOptions: newValue }, i)
                        }}
                        otherOptionValue={row.otherOption}
                        setOtherOptionValue={(newValue: boolean) => {
                          setQuestionValue({ otherOption: newValue }, i)
                        }}
                      />
                      {/* Footer */}
                      <div className={classNames(selected ? "flex" : "hidden", 'justify-end items-center border-t-[1.5px] mt-4 pt-2 ')}>
                        <MenuIcon
                          title="Duplicate"
                          onClick={duplicateQuestion}
                          additionalClass='mx-[1px]'
                          icon={<MdContentCopy />}
                        />
                        <MenuIcon
                          title="Delete"
                          onClick={removeQuestion}
                          additionalClass='mx-[1px]'
                          icon={<FiTrash2 />}
                        />
                        <div className=' border-l-[1.5px] h-8 mx-2'></div>
                        <span className='text-sm ml-2 mr-3'>Required</span>
                        <Toggle
                          value={row.required}
                          handleChange={(checked: boolean) => setQuestionValue({ required: checked }, i)}
                        />
                        <DropdownButton
                          value={row.moreOptionValues}
                          onChange={(newVal) => setQuestionValue({ moreOptionValues: newVal }, i)}
                          optionsHeight={row.moreOptionsData?.optionsHeight ?? 0}
                          dropdownItemData={row.moreOptionsData?.items ?? []}
                          cardRef={cardRefs?.current[i]}
                          selected={selected}
                        >
                          <button className="w-12 h-12 flex items-center justify-center hover:bg-slate-100 active:bg-slate-200 rounded-full">
                            <BiDotsVerticalRounded size={24} color="#5f6368" />
                          </button>
                        </DropdownButton>
                      </div>
                    </div>
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