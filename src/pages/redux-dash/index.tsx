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

import { MdOutlineSmartDisplay, MdOutlineImage, MdContentCopy, } from 'react-icons/md'
import { IoAddCircleOutline, IoEllipsisHorizontalSharp } from 'react-icons/io5'
import { TbFileImport } from 'react-icons/tb'
import { AiOutlineFontSize } from 'react-icons/ai'
import { TiEqualsOutline } from 'react-icons/ti'
import { IconContext } from 'react-icons';
import { IoMdCheckmark } from 'react-icons/io';
import { FiTrash2 } from 'react-icons/fi'

import { defaultQuestion, choicesData, additionalOptionsMap, moreOptionsArr } from '@components/dashboard/defaults'
import { debounce, getLayoutY, swap } from '@helpers'
import { DropdownItemsList, Item, Content, ListItem } from '@interfaces/dropdown.interface';
import { Question } from '@interfaces/question.interface';
import { bindActionCreators } from 'redux'

import { setQuestionValue as setQuestionValueDispatch } from '@store/question/action';
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
const CardContainer = ({ children, currentlyDragged = false, handleDragStart, cardRef, onClick, containerClass = "", selected = false, topHeader = false, ...props }: ContainerProps) => {
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
  reposition: boolean,
  minHeight: string,
  divClick: boolean,
  selectedIndex: number | null,
  currentlyDragged: number | null,
  currentSwapIndex: number | null,
  navbarHeight: number
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
  // const [questions, setQuestions] = useState<Question[]>([defaultQuestion]);

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
  //#region content

  //#endregion
  return (
    <Layout>
      {props.tabIndex == 0 && (
        <>
          <div
            className="flex justify-center mt-3"
            ref={layoutRef}
            style={{
            }}
          >
            <div className='sm:w-[770px] pb-16'
              style={{ minHeight: state.minHeight, cursor: state.currentlyDragged != null ? "move" : "auto" }}
            >
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
              {props.questions.map((row: Question, i: number) =>
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
                            props.setQuestionValue({ index: i, payload: { title: e.target.value } })
                          }}
                          placeholder={`Question ${i + 1}`}
                        />
                      </div>
                    </div>
                  </div>
                </CardContainer>
              )}
            </div>
          </div>
        </>
      )
      }
    </Layout >
  )
}

const mapStateToProps = (state: any) => ({
  tabIndex: state.tab.tabIndex,
  questions: state.question.questions
})

const mapDispatchToProps = (dispatch: any) => {
  return { setQuestionValue: bindActionCreators(setQuestionValueDispatch, dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(Page)