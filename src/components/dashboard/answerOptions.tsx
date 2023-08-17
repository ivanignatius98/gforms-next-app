import React, { useEffect, useState, useRef, useMemo } from 'react'
// import Select from '../forms/general-form/select'
import TextAnswer from './textAnswer'
import Input from '@modules/Input'
import { Question } from '@interfaces/question.interface';
import { MdRadioButtonUnchecked, MdCheckBoxOutlineBlank, MdClose, MdOutlineImage, MdWarning, } from 'react-icons/md'
import MenuIcon from '@modules/MenuIcon'
import { FiTrash2 } from 'react-icons/fi'
import { IoAddCircleOutline, IoEllipsisHorizontalSharp } from 'react-icons/io5'
import { OptionChoices } from '@interfaces/question.interface';
import { IconContext } from 'react-icons';
import Tooltip from '@modules/Tooltip'
import { classNames } from '@helpers';
import Select from '@modules/Select'
import { choicesData } from '@components/dashboard/defaults'
import { Item } from '@interfaces/dropdown.interface';

interface Icon {
    type: string
    index?: number
}
const OptionIcon = ({ type, index }: Icon) => {
    const props = {
        size: 21,
        style: {
            color: "darkgray"
        }
    }
    let content = <></>
    switch (type) {
        case "multiple_choice":
            content = <MdRadioButtonUnchecked {...props} />
            break;
        case "checkboxes":
            content = <MdCheckBoxOutlineBlank {...props} />
            break;
        case "dropdown":
            content = <>{index ? index + 1 : 1}</>
            break;
        default:
            break;
    }
    return content
}
interface AddProps {
    type: string
    index: number
    label?: string
    addOther: boolean
    setOtherOption: (val: boolean) => void
    addAnswerOption: () => void
}
const AddOption = ({ type, index, addAnswerOption, setOtherOption, label = 'Add Option', addOther = false }: AddProps) => {
    const containerRef = useRef<HTMLDivElement>(null)
    return (
        <>
            <div ref={containerRef} className="absolute top-0 left-0 pointer-events-none opacity-0">
                {label}
            </div>
            <div className='h-12 flex items-center text-sm group'>
                <div className=''>
                    <OptionIcon type={type} index={index} />
                </div>
                <div onClick={addAnswerOption} className='mx-2'>
                    <Input
                        showOnHover
                        value={""}
                        readOnly={true}
                        placeholder={label}
                        style={{ width: (containerRef.current?.clientWidth ?? 83) - 10 }}
                    />
                </div>
                {addOther && (
                    <>
                        or
                        <button
                            className="p-2 rounded text-blue-600 font-semibold hover:bg-blue-50 active:bg-blue-100"
                            onClick={() => setOtherOption(true)}
                        >
                            {`add "Other"`}
                        </button>
                    </>
                )}
            </div>
        </>
    )
}
interface ChoiceProps {
    type: string
    otherOption: boolean
    selected: boolean
    goToSection: boolean
    answerOptions: OptionChoices[]
    setAnswerOptions: (newValue: OptionChoices[]) => void
    setOtherOption: (newValue: boolean) => void
}
const ChoicesAnswer = ({ type, answerOptions, setAnswerOptions, otherOption, setOtherOption, selected = false, goToSection }: ChoiceProps) => {
    const inputRefs = useRef<HTMLInputElement[]>([])
    const addAnswerOption = () => {
        const prevProps = [...answerOptions]
        const newValue = `Option ${prevProps.length + 1}`
        prevProps.push({
            value: newValue,
            image: '',
            previewImage: ''
        })
        setAnswerOptions([...prevProps])
    }
    const setItemValue = (newValue: string, index: number, prevError: boolean = false) => {
        const prevProps = [...answerOptions]
        const error = newValue != "" && prevProps.filter((row, i) => i != index && row.value === newValue).length > 0
        prevProps[index] = {
            ...prevProps[index],
            value: newValue,
            error,
            persistError: prevError && error
        }
        setAnswerOptions([...prevProps])
    }
    const handleSectionSelect = (value: Item, index: number) => {
        const prevProps = [...answerOptions]
        prevProps[index] = {
            ...prevProps[index],
            goToSectionVal: value,
        }
        setAnswerOptions([...prevProps])
    }
    // const setItemImage = (newImage, index) => {
    //     const temp = [...answerOptions]
    //     temp[index] = { ...temp[index], ...newImage }
    //     // setQuestionValue({ answerOptions: temp })
    //     setAnswerOptions([...temp])

    // }
    // const removeImage = (index) => {3444444444
    //     const temp = [...answerOptions]
    //     temp[index] = { ...temp[index], ...{ image: '', previewImage: '' } }
    //     // setQuestionValue({ answerOptions: temp })
    //     setAnswerOptions([...temp])

    // }
    const dummySections = [
        {
            value: "section_1",
            label: "Continue to next section",
            group: 0
        }, {
            value: "section_2",
            label: "Go to section 1",
            group: 0
        }, {
            value: "section_3",
            label: "Submit form",
            group: 0
        }
    ]
    const deleteItem = (index: number) => {
        const prevProps = [...answerOptions]
        const newProps = prevProps.slice()
        newProps.splice(index, 1)
        setAnswerOptions([...newProps])
        setTimeout(() => inputRefs.current[index - 1 > 0 ? index - 1 : 0].focus(), 10);
    }
    const otherType = type != 'dropdown'
    useEffect(() => {
        inputRefs.current = inputRefs.current.slice(0, answerOptions.length)
    }, [answerOptions])

    const memoizedAnswerOptions = useMemo(() => answerOptions, [answerOptions]);
    return (
        <>
            {memoizedAnswerOptions.map((item: OptionChoices, index: number) => (
                <div
                    key={index}
                    className={classNames(
                        selected ? "group" : "",
                        'ml-[-1.5rem] mr-[-1.5rem]'
                    )}
                >
                    <div className='h-12 flex items-center px-6 relative'>
                        <div className='hidden group-hover:block absolute left-2 transform rotate-90 cursor-move'>
                            <IconContext.Provider value={{ style: { display: 'flex' } }}>
                                <div>
                                    <IoEllipsisHorizontalSharp size={17} style={{ marginBottom: "-12px", color: "darkgray" }} />
                                    <IoEllipsisHorizontalSharp size={17} style={{ color: "darkgray" }} />
                                </div>
                            </IconContext.Provider>
                        </div>
                        <div className='mr-2'>
                            <OptionIcon type={type} index={index} />
                        </div>
                        <div className="flex-grow max-w-full">
                            <Input
                                inputRef={(el: any) => inputRefs.current[index] = el}
                                showOnHover
                                containerClass='text-sm'
                                autoFocus={answerOptions.length > 1}
                                value={item.value}
                                error={item.error}
                                alwaysHighlight={true}
                                onChange={({ target }) => {
                                    setItemValue(target.value, index)
                                }}
                                onBlur={({ target }) => {
                                    const defaultValue = `Option ${index + 1}`
                                    const isError = target.value === '' || item.error
                                    const hasDefaultError = target.value === defaultValue
                                    if (item.persistError || hasDefaultError || isError) {
                                        setItemValue(
                                            item.persistError ? target.value : hasDefaultError || isError ? defaultValue : target.value,
                                            index,
                                            hasDefaultError || isError
                                        );
                                    }
                                }}
                                placeholder={`Option ${index + 1}`}
                            />
                        </div>
                        <div className={classNames(item.persistError ? "flex" : 'hidden group-hover:flex group-focus-within:flex')}>
                            {item.error &&
                                <Tooltip
                                    tooltipText="Duplicate options not supported"
                                    showPointer={false}
                                    additionalClass="mt-2"
                                >
                                    <div className='opacity-70 ml-2'>
                                        <MdWarning color='red' size={24} />
                                    </div>
                                </Tooltip>
                            }
                        </div>
                        <div className='invisible group-hover:visible group-focus-within:visible'>
                            <MenuIcon icon={<MdOutlineImage />} />
                        </div>
                        <div className={classNames(answerOptions.length > 1 && selected ? "" : "invisible")}>
                            <MenuIcon onClick={() => deleteItem(index)} icon={<MdClose />} />
                        </div>
                        {goToSection &&
                            <div className="w-72">
                                <Select
                                    borderless
                                    value={item.goToSectionVal ?? dummySections[1]}
                                    onChange={(val) => handleSectionSelect(val, index)}
                                    options={dummySections}
                                />
                            </div>
                        }
                    </div>
                </div>
            ))}
            {otherOption && otherType && (
                <div className='h-12 flex items-center group'>
                    <div className='mr-2'>
                        <OptionIcon type={type} />
                    </div>
                    <div className="flex-grow w-[300px] max-w-full">
                        <Input
                            showFooter={false}
                            value=""
                            placeholder="Other..."
                            disabled
                            className='bg-inherit text-sm'
                        />
                        <div className='h-0.5'>
                            <div className="hidden group-hover:block w-full border-dotted border-[1px] border-b-slate-400  border-spacing-8 overflow-hidden" />
                        </div>
                    </div>
                    {selected &&
                        <MenuIcon
                            onClick={() => setOtherOption(false)}
                            icon={<MdClose />} />
                    }
                </div>
            )}
            {selected &&
                <AddOption
                    type={type}
                    addOther={(!otherOption && otherType)}
                    index={answerOptions.length}
                    addAnswerOption={addAnswerOption}
                    setOtherOption={setOtherOption}
                />
            }
        </>
    )

}
interface AnswerProps {
    questionProps: Question
    selected: boolean
    optionsValue: OptionChoices[]
    otherOptionValue: boolean
    setOptionsValue: (newValue: OptionChoices[]) => void,
    setOtherOptionValue: (newValue: boolean) => void,
}
const AnswerOption = ({ questionProps, selected = false, setOptionsValue, optionsValue, otherOptionValue, setOtherOptionValue }: AnswerProps) => {
    const {
        type,
        moreOptionValues: initialMoreOptions,
    } = questionProps

    const { value } = type
    // const [content, setContent] = useState<JSX.Element | null>(null)
    // useEffect(() => {
    // if (value == 'short_answer' || value == 'paragraph' || value == 'date' || value == 'time') {
    //     setContent(<TextAnswer type={value} />)
    // } else if (value == 'multiple_choice' || value == 'checkboxes' || value == 'dropdown') {
    //     setContent(<ChoicesAnswer
    //         type={value}
    //         answerOptions={answerOptionsValue}
    //         setAnswerOptions={setAnswerOptions}
    //         otherOption={otherOption}
    //         setOtherOption={setOtherOption}
    //         selected={selected}
    //         goToSection={initialMoreOptions?.includes("go_to_section")}
    //     />)
    // } else {
    //     setContent(<></>)
    // }
    // }, [value, answerOptions, otherOption, selected, initialMoreOptions])

    // useEffect(() =>{
    //     setOptionsValue(answerOptions)
    // }, [answerOptions])
    // else if (value == 'linear_scale') {
    //     content = <LinearScaleAnswer
    //         linearValueOptions={linearValueOptions}
    //         setQuestionValue={setQuestionValue} />
    // } else if (value == 'multiple_choice_grid') {
    //     content = <GridChoicesAnswer
    //         type={value}
    //         gridRowOptions={gridRowOptions}
    //         gridColumnOptions={gridColumnOptions}
    //         setQuestionValue={setQuestionValue}
    //     />
    // }
    let content = <></>

    if (value == 'short_answer' || value == 'paragraph' || value == 'date' || value == 'time') {
        content = (<TextAnswer type={value} />)
    } else if (value == 'multiple_choice' || value == 'checkboxes' || value == 'dropdown') {
        content = (<ChoicesAnswer
            type={value}
            answerOptions={optionsValue}
            setAnswerOptions={setOptionsValue}
            otherOption={otherOptionValue}
            setOtherOption={setOtherOptionValue}
            selected={selected}
            goToSection={initialMoreOptions?.includes("go_to_section")}
        />)
    } else {
        content = (<></>)
    }
    return content
}

export default AnswerOption