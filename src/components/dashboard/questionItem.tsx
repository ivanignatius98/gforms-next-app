import { classNames } from "@helpers"
import Input from '@modules/Input'
import MenuIcon from "@modules/MenuIcon"
import { MdContentCopy, MdOutlineImage } from "react-icons/md"
import { additionalOptionsMap, choicesData, moreOptionsArr } from "./defaults"
import { Item } from "@interfaces/dropdown.interface"
import AnswerOptions from '@components/dashboard/answerOptions'
import { OptionChoices, Question } from "@interfaces/question.interface"
import Select from "@modules/Select"
import { FiTrash2 } from "react-icons/fi"
import Toggle from "@modules/Toggle"
import DropdownButton from "@modules/DropdownButton"
import { BiDotsVerticalRounded } from "react-icons/bi"
import { MutableRefObject, Ref, useState } from "react"

interface QuestionProps {
  selected: boolean
  textPreview: boolean
  inputRef?: Ref<HTMLInputElement>
  i: number
  row: Question
  setQuestionValue: (payload: any, index: number) => void
  duplicateQuestion: () => void
  removeQuestion: () => void
  cardRefs: MutableRefObject<HTMLDivElement[]> | null
}
const Component = ({
  selected,
  textPreview,
  inputRef,
  i,
  row,
  setQuestionValue,
  duplicateQuestion,
  removeQuestion,
  cardRefs
}: QuestionProps) => {

  const [questionRow, setQuestionRow] = useState<Question>(row)

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
  // #endregion
  return (
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
                value={questionRow.type}
                onChange={(newValue) => handleTypeChange(newValue)}
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
    </div>)
}

export default Component