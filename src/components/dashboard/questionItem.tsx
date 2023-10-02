import { classNames } from "@helpers"
import Input from '@modules/Input'
import MenuIcon from "@modules/MenuIcon"
import { MdContentCopy, MdOutlineImage } from "react-icons/md"
import { BiExpandVertical, BiCollapseVertical } from "react-icons/bi"
import { additionalOptionsMap, choicesData, moreOptionsArr } from "./defaults"
import { DropdownItemsList, Item } from "@interfaces/dropdown.interface"
import AnswerOptions from '@components/dashboard/answerOptions'
import { OptionChoices, Question, OptionLinears, SectionItem } from "@interfaces/question.interface"
import Select from "@modules/Select"
import { FiTrash2 } from "react-icons/fi"
import Toggle from "@modules/Toggle"
import DropdownButton from "@modules/DropdownButton"
import { BiDotsVerticalRounded } from "react-icons/bi"
import React, { MutableRefObject, Ref, useCallback, useContext, useEffect, useState } from "react"
import { QuestionsContext } from '@context/question.context';
import Dropdown from "@modules/Dropdown"
import Tooltip from "@modules/Tooltip"

interface QuestionProps {
  textPreview: boolean
  inputRef?: Ref<HTMLInputElement>
  duplicateQuestion: () => void
  removeQuestion: () => void
  cardRefs: MutableRefObject<HTMLDivElement[]> | null
  onChange: (val: Question, index: number) => void
  sections: SectionItem[]
}
const Component = ({
  textPreview,
  inputRef,
  duplicateQuestion,
  removeQuestion,
  cardRefs,
  onChange
}: QuestionProps) => {
  const { selected, row, i, isSectionHeader } = useContext(QuestionsContext)
  const [questionRow, setQuestionRow] = useState<Question>(row)
  useEffect(() => {
    setQuestionRow(row)
  }, [row])

  useEffect(() => {
    onChange(questionRow, i)
  }, [questionRow, i])
  const handleValueChange = (payload: any) => {
    setQuestionRow((prevState) => {
      return { ...prevState, ...payload }
    })
  }

  //#region map more options
  interface contents {
    content: Item
  }
  interface SelectItems {
    header?: string
    items: contents[]
  }

  const handleTypeChange = (event: Item) => {
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

    setQuestionRow((prevState) => {
      return {
        ...prevState,
        moreOptionValues: [],
        type: event,
        moreOptionsData: {
          items: tempGroup,
          optionsHeight
        }
      }
    })
  }
  const dropdownItemData: DropdownItemsList[] =
    [{
      items: [{
        onClick: () => { console.log("TEST") },
        content: {
          label: "Duplicate Section"
        }
      }, {
        onClick: () => { console.log("TEST2") },
        content: {
          label: "Move Section"
        }
      }, {
        onClick: () => { console.log("TEST3") },
        content: {
          label: "Delete Section"
        }
      }, {
        onClick: () => { console.log("TEST4") },
        content: {
          label: "Merge with above"
        }
      }]
    }
    ]
  const [leftPosition, setLeftPosition] = useState(0);
  const [showTooltip, setShowTooltip] = useState(true)
  const [topPosition, setTopPosition] = useState(48);
  const repositionOptions = useCallback(() => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const thresholdWidth = 1070;
    const newPost = screenWidth - thresholdWidth + ((screenWidth - thresholdWidth) * -0.5)
    const cardRef = cardRefs?.current[i]
    // set y position
    if (selected && cardRef != undefined) {
      const currentY = cardRef.getBoundingClientRect().bottom + 176
      if (screenHeight < (currentY + 24)) {
        setTopPosition(screenHeight - (currentY - 24))
      } else {
        setTopPosition(48)
      }
    }
    // set x position
    if (newPost <= -248) {
      setLeftPosition(-248)
    } else if (screenWidth < thresholdWidth) {
      setLeftPosition(newPost);
    } else {
      setLeftPosition(0);
    }
  }, [cardRefs?.current[i], selected])

  useEffect(() => {
    repositionOptions()
    window.addEventListener('resize', repositionOptions);
    return () => {
      window.removeEventListener('resize', repositionOptions);
    };
  }, [repositionOptions]);

  useEffect(() => {
    if (showTooltip) { repositionOptions() }
  }, [showTooltip, repositionOptions])
  // #endregion
  return (
    <>
      {isSectionHeader ? <>
        <div className='py-4 pl-6 pr-4 z-0'>
          <div className="flex">
            <div className=" flex-grow">
              <Input
                containerClass='my-1'
                className="text-md"
                name="description"
                value={questionRow.title}
                onChange={(e) => handleValueChange({ title: e.target.value })}
                placeholder="Section Title (Optional)"
              />
            </div>
            <MenuIcon
              title={`${questionRow.collapsed ? "Collapse" : "Expand"} Section`}
              onClick={() => handleValueChange({ collapsed: !questionRow.collapsed })}
              additionalClass='mx-[1px]'
              icon={questionRow.collapsed ? <BiCollapseVertical /> : <BiExpandVertical />}
            />
            <React.Fragment>
              <Tooltip
                additionalContainerClass=''
                orientation="bottom"
                showPointer={false}
                show={showTooltip}
                tooltipText="More"
              >
                <Dropdown
                  {...{ dropdownItemData }}
                  setOpen={(val) => setShowTooltip(!val)}
                  optionContainerStyle={{ top: topPosition, left: leftPosition }}
                >
                  <button className="w-12 h-12 flex items-center justify-center hover:bg-slate-100 active:bg-slate-200 rounded-full">
                    <BiDotsVerticalRounded size={24} color="#5f6368" />
                  </button>
                </Dropdown>
              </Tooltip>
            </React.Fragment>

          </div>
          <Input
            containerClass='my-1'
            className="text-sm"
            name="description"
            value={questionRow.description}
            onChange={(e) => handleValueChange({ description: e.target.value })}
            placeholder="Description (Optional)"
          />
        </div>
      </> :
        <div className={classNames(selected ? "p-6 pb-2" : "p-6")}>
          <div className='flex flex-wrap items-start'>
            <div className={classNames(textPreview && !selected ? "hidden" : "flex-grow w-[300px] max-w-full")}>
              <Input
                alwaysHighlight
                inputRef={inputRef}
                showFooter={selected}
                containerClass={classNames(selected ? "bg-gray-100" : "bg-none mb-[2px]")}
                className={classNames(selected ? "p-3" : "", "bg-inherit text-base")}
                name="question"
                value={questionRow.title}
                onChange={(e) => handleValueChange({ title: e.target.value })}
                placeholder="Question"
              />
            </div>
            {textPreview && !selected && (
              <div className='my-[2px] mb-1 flex'>
                <div className='text-base'>{questionRow.title || "Question"}</div>
                {questionRow.required && <div className='ml-1 text-red-500'>*</div>}
              </div>
            )}
            {selected && (
              <>
                <div className='mx-3 z-0'>
                  <MenuIcon icon={<MdOutlineImage />} />
                </div>
                <div className="w-60">
                  <Select
                    value={questionRow.type}
                    onChange={(newValue) => handleTypeChange(newValue)}
                    options={choicesData}
                  />
                </div>
              </>
            )}
          </div>
          {/* Description */}
          {questionRow.moreOptionValues?.includes("description") &&
            <Input
              alwaysHighlight
              showFooter={selected}
              containerClass="bg-none my-2"
              className="bg-inherit text-sm"
              name="description"
              value={questionRow.description}
              onChange={(e) => handleValueChange({ description: e.target.value })}
              placeholder={`Description`}
            />
          }
          {/* Content */}
          <div className='mt-4'>
            <AnswerOptions
              setValue={handleValueChange}
              questionRow={questionRow}
            />
          </div>
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
            <span className='text-sm ml-2 mr-3 cursor-default select-none' onClick={() => handleValueChange({ required: !questionRow.required })}>
              {questionRow.type.value == "multiple_choice_grid" || questionRow.type.value == "checkbox_grid" ? "Require a response in each row" : "Required"}
            </span>
            <Toggle
              value={questionRow.required}
              handleChange={(checked: boolean) => handleValueChange({ required: checked })}
            />
            <DropdownButton
              value={questionRow.moreOptionValues}
              onChange={(newVal) => handleValueChange({ moreOptionValues: newVal })}
              optionsHeight={questionRow.moreOptionsData?.optionsHeight ?? 0}
              dropdownItemData={questionRow.moreOptionsData?.items ?? []}
              cardRef={cardRefs?.current[i]}
              selected={selected}
            >
              <button className="w-12 h-12 flex items-center justify-center hover:bg-slate-100 active:bg-slate-200 rounded-full">
                <BiDotsVerticalRounded size={24} color="#5f6368" />
              </button>
            </DropdownButton>
          </div>
        </div>}
    </>
  )
}

export default Component