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
import { BiDotsVerticalRounded, BiChevronUp, BiChevronDown } from 'react-icons/bi';

import { defaultQuestion, defaultSection } from '@components/dashboard/defaults'
import { classNames, debounce, getLayoutY, swap, getYCoordFromEvent, isTouchEvent, separateSingleRowFromArray } from '@helpers'
import { Question, SectionItem } from '@interfaces/question.interface';
import DragWrapper from '@modules/Drag';
import StaticDragWrapper from '@modules/StaticDrag';

import { QuestionsContext } from '@context/question.context';
import Modal from '@modules/Modal';
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


const defaultSectionValue = { xid: uuidv4(), value: "Form Title" }
const firstQuestionXid = uuidv4()
const Page: React.FC<Props> = (props) => {
  const [state, setState] = useState<State>({
    title: "",
    description: "",
    minHeight: "100vh",
  })


  const [questions, setQuestions] = useState<Question[]>([{
    ...defaultSection,
    xid: defaultSectionValue.xid,
    title: defaultSectionValue.value
  }, {
    ...defaultQuestion,
    xid:firstQuestionXid
  }]);

  const [cardClick, setCardClick] = useState<ClickState>({
    cardIndex: 0,
    divClickedOrigin: true
  });

  const [itemXid, setItemXid] = useState<string | null | undefined>(firstQuestionXid)
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
        item.sectionCounter = sectionIndex
        sectionIndex++
      }
    });
    setSections([...extractedData])
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
      onClick: () => { }
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
  const handleQuestionChange = (val: Question, index: number) => {
    if (val.type.value == "section_header") {
      setSections((prevValue) => {
        const idx = prevValue.findIndex(section => section.xid === val.xid)
        prevValue[idx] = { ...prevValue[idx], value: val.title }
        return prevValue
      })
    }
    questionRef.current[index] = val
  }

  //#region sections
  const [sections, setSections] = useState<SectionItem[]>([defaultSectionValue])
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

  const collapseSection = (index: number, collapse: boolean) => {
    setQuestions(() => {
      const curr = questionRef.current
      const affected = []
      if (index < curr.length) {
        if (curr[index].type.value != "section_header") {
          for (let i = index; i >= 0; i--) {
            curr[i].collapsed = !collapse
            affected.push(curr[i])
            if (curr[i].type.value == "section_header") {
              break;
            }
          }
        } else {
          curr[index].collapsed = !collapse
        }

        for (let i = index + 1; i < curr.length; i++) {
          if (curr[i].type.value == "section_header") {
            break;
          }
          curr[i].collapsed = !collapse
          affected.push(curr[i])
        }
      }
      return [...curr]
    })
  }
  const [moveModalOpen, setMoveModalOpen] = useState<Boolean>(false)
  interface SectionData {
    separated: SectionItem | null,
    data: SectionItem[]
  }
  const sectionRef = useRef<SectionData>({ separated: null, data: [] })
  const handleSectionDrag = (nextIndex: number) => {
    if (sections.length > 1) {
      setSections((prev) => {
        if (sectionRef.current.separated == null)
          return prev

        const newData = [...sectionRef.current.data];
        // Use splice on the copied array to insert the separated item at the specified index
        newData.splice(nextIndex, 0, sectionRef.current.separated);
        return newData
      })
    }
  }
  const handleSectionSubmit = (items: SectionItem[]) => {
    const sectionMap = new Map()
    let tempArr: Question[] = []
    let currSection = null
    for (let row of questionRef.current) {
      if (row.type.value == "section_header") {
        if (currSection != null) {
          sectionMap.set(currSection, tempArr)
        }
        // initial
        currSection = row.xid
        tempArr = [row]
        continue
      }

      tempArr.push(row)
    }
    if (tempArr.length > 0) {
      sectionMap.set(currSection, tempArr)
    }
    let arr: Question[] = []
    let sectionCounter = 1
    for (let row of items) {
      const sectionItems = sectionMap.get(row.xid)
      sectionItems[0].sectionCounter = sectionCounter
      arr = [...arr, ...sectionItems]
      sectionCounter++
    }
    setQuestions([...arr])
  }

  //#endregion
  return (
    <Layout>
      {props.tabIndex == 0 && (
        <>
          <MoveSections
            moveModalOpen={moveModalOpen}
            setMoveModalOpen={setMoveModalOpen}
            items={sections}
            onDragChange={handleSectionDrag}
            startDrag={(index: number) => {
              sectionRef.current = separateSingleRowFromArray(sections, index)
            }}
            onMoveItem={(index, nextIndex) => {
              if (nextIndex >= 0 && nextIndex < sections.length) {
                setSections((prev) => swap([...prev], index, nextIndex))
              }
            }}
            onSubmit={handleSectionSubmit}
          />
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
                    <div className='pt-6 pb-2 px-6'>
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
              {/* <CardContainer
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
              </CardContainer> */}
              {questions.map((row: Question, i: number) => {
                const selected = cardClick.cardIndex != -1 && itemXid == row.xid
                const textPreview = row.required || row.title === ""
                const isSectionHeader = row.type.value == "section_header"
                // const isSectionHeader = showSections && row.type.value == "section_header"
                return (
                  <QuestionsContext.Provider
                    key={i}
                    value={{ selected, row, i, isSectionHeader, setMoveModalOpen, showSections }}
                  >
                    <div className='my-4'>
                      {isSectionHeader && i > 0 ?
                        <div className='h-24'>
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
                      <CardContainer
                        cardRef={(el: any) => cardRefs.current[i] = el}
                        selected={selected}
                        onClick={(event) => {
                          if (!selected) {
                            handleCardClick(event.target instanceof HTMLDivElement, i, row.xid)
                          }
                          if (event.target instanceof HTMLDivElement) {
                            collapseSection(i, true)
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
                        sectionHeader={(isSectionHeader && showSections) ?
                          <SectionHat length={sections.length} count={row.sectionCounter} />
                          : null
                        }
                        topHeader={i == 0}
                      >
                        <QuestionItem
                          textPreview={textPreview}
                          inputRef={(el: any) => inputRefs.current[i] = el}
                          duplicateQuestion={duplicateQuestion}
                          removeQuestion={removeQuestion}
                          cardRefs={cardRefs}
                          onChange={handleQuestionChange}
                          sections={sections}
                          onCollapse={collapseSection}
                        />
                      </CardContainer>
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

interface MoveSectionProps {
  moveModalOpen: Boolean
  setMoveModalOpen: (val: Boolean) => void
  items: SectionItem[]
  onDragChange: (nextIndex: number) => void
  onMoveItem: (index: number, nextIndex: number) => void
  startDrag: (index: number) => void
  onSubmit: (items: SectionItem[]) => void
}
const MoveSections = ({ moveModalOpen,
  setMoveModalOpen,
  items,
  onDragChange,
  startDrag,
  onMoveItem,
  onSubmit
}: MoveSectionProps) => {
  const itemsRef = useRef<HTMLDivElement[]>([])
  useEffect(() => {
    itemsRef.current = itemsRef.current.slice(0, items.length)
  }, [items])
  const [currentlyDraggedItem, setCurrentlyDraggedItem] = useState<SectionItem & { index: number } | null>(null)
  const [dragY, setDragY] = useState(0)
  const [selectedXid, setSelectedXid] = useState<string | null>(null)

  return (
    <Modal
      isOpen={moveModalOpen}
      setIsOpen={setMoveModalOpen}
    >
      {currentlyDraggedItem != null && (
        <StaticDragWrapper
          cardRefs={itemsRef}
          draggedItem={currentlyDraggedItem}
          y={dragY}
          onDragEnd={() => {
            setCurrentlyDraggedItem(null);
            setSelectedXid(null)
          }}
          move={(newIndex: number) => onDragChange(newIndex)}
          manualOffset={48}
        >
          <div className="flex min-h-[64px] border-t-[0.5px] border-b-[0.5px] relative z-0 shadow-md pointer-events-none bg-white" >
            <div className=' bg-blue-400 flex left-0 absolute bottom-0 w-1 h-full'></div>
            <div className='flex items-center w-[60px] justify-center cursor-move'>
              <div className='block transform rotate-90'>
                <IconContext.Provider value={{ style: { display: 'flex' } }}>
                  <div>
                    <IoEllipsisHorizontalSharp size={17} style={{ marginBottom: "-12px", color: "darkgray" }} />
                    <IoEllipsisHorizontalSharp size={17} style={{ color: "darkgray" }} />
                  </div>
                </IconContext.Provider>
              </div>
            </div>
            <div className='flex flex-1 items-center'>
              <div className='flex-1'>
                <div className='text-sm font-medium'>
                  {currentlyDraggedItem.value}
                </div>
                <div className='text-xs text-gray-500'>
                  Section {currentlyDraggedItem.index + 1} of {items.length}
                </div>
              </div>
              <div className='flex pr-4'>
                <MenuIcon icon={<BiChevronUp />} />
                <MenuIcon icon={<BiChevronDown />} />
              </div>
            </div>
          </div>
        </StaticDragWrapper>)}
      <div className='flex flex-col items-stretch h-full overflow-auto'>
        <div className='m-[18px] flex-grow-0'>
          <h3 className="text-base leading-6 text-gray-900">Reorder sections</h3>
          <div className="mt-2">
            <p className="text-xs text-gray-500">
              Verify the section navigation logic after reordering.
            </p>
          </div>
        </div>
        <span className='flex-grow-[2] flex-shrink-[2] overflow-y-auto border-t-[0.5px]'>
          {/* item */}
          {items.map((row: SectionItem, index: number) =>
            <div
              className={classNames(
                currentlyDraggedItem?.xid == row.xid ? "opacity-0" : "",
                "flex min-h-[64px] border-t-[0.5px] border-b-[0.5px] relative group"
              )}
              ref={(el: any) => itemsRef.current[index] = el}
              key={index}
              onClick={(event) => { if (event.target instanceof HTMLDivElement) setSelectedXid(row.xid) }}
            >
              <div className="top-[31px] absolute w-full">
              </div>
              <div
                className={classNames(
                  "flex left-0 absolute bottom-0 w-1 h-full",
                  row.xid == selectedXid ? "bg-blue-400" : "group-hover:bg-blue-400"
                )}
              ></div>
              <div className='flex items-center w-[60px] justify-center cursor-move'
                onMouseDown={(event) => {
                  event.preventDefault()
                  setDragY(event.clientY - 81)
                  setCurrentlyDraggedItem({ ...row, index })
                  startDrag(index)
                }}
              >
                <div className='block transform rotate-90'>
                  <IconContext.Provider value={{ style: { display: 'flex' } }}>
                    <div>
                      <IoEllipsisHorizontalSharp size={17} style={{ marginBottom: "-12px", color: "darkgray" }} />
                      <IoEllipsisHorizontalSharp size={17} style={{ color: "darkgray" }} />
                    </div>
                  </IconContext.Provider>
                </div>
              </div>
              <div className='flex flex-1 items-center'>
                <div className='flex-1'>
                  <div className='text-sm font-medium'>
                    {row.value}
                  </div>
                  <div className='text-xs text-gray-500'>
                    Section {index + 1} of {items.length}
                  </div>
                </div>
                <div className='flex pr-4'>
                  <MenuIcon
                    disabled={index == 0}
                    icon={<BiChevronUp />}
                    onClick={() => {
                      setSelectedXid(row.xid)
                      onMoveItem(index, index - 1)
                    }}
                  />
                  <MenuIcon
                    disabled={index == items.length - 1}
                    icon={<BiChevronDown />}
                    onClick={() => {
                      setSelectedXid(row.xid)
                      onMoveItem(index, index + 1)
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </span>
        <div className="p-4 text-right flex-shrink-0 border-t-[0.5px]">
          <button
            type="button"
            className="inline-flex justify-center rounded-md border border-transparent  p-2 text-sm font-medium text-gray-500  hover:bg-gray-50"
            onClick={() => setMoveModalOpen(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="inline-flex justify-center rounded-md border border-transparent  p-2 text-sm font-medium text-teal-600 hover:bg-gray-50"
            onClick={() => {
              setMoveModalOpen(false);
              onSubmit(items)
            }}
          >
            Save
          </button>
        </div>
      </div>
    </Modal>)
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