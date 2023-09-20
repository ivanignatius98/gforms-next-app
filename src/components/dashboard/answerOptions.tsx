import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react'
import TextAnswer from './textAnswer'
import Input from '@modules/Input'
import { Question } from '@interfaces/question.interface';
import { MdRadioButtonUnchecked, MdCheckBoxOutlineBlank, MdClose, MdOutlineImage, MdWarning, } from 'react-icons/md'
import MenuIcon from '@modules/MenuIcon'
import { IoEllipsisHorizontalSharp } from 'react-icons/io5'
import { OptionChoices, ValueLabel, OptionLinears } from '@interfaces/question.interface';
import { IconContext } from 'react-icons';
import Tooltip from '@modules/Tooltip'
import { classNames, getLayoutY, swap } from '@helpers';
import Select from '@modules/Select'
import { Item } from '@interfaces/dropdown.interface';
import DragWrapper from '@modules/Drag';
import { VscTriangleDown } from 'react-icons/vsc';

const iconProps = {
    size: 21,
    style: {
        color: "darkgray"
    }
}
interface Icon {
    type: string
    index?: number
}
const OptionIcon = ({ type, index }: Icon) => {
    let content = <></>
    switch (type) {
        case "multiple_choice":
            content = <MdRadioButtonUnchecked {...iconProps} />
            break;
        case "checkboxes":
            content = <MdCheckBoxOutlineBlank {...iconProps} />
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
    // const removeImage = (index) => {
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
        inputRefs.current[index - 1 > 0 ? index - 1 : 0].focus()
        setTimeout(() => setAnswerOptions([...newProps]), 10);
    }
    const otherType = type != 'dropdown'
    useEffect(() => {
        inputRefs.current = inputRefs.current.slice(0, answerOptions.length)
    }, [answerOptions])
    const handleKeyDown = (event: any, index: number) => {
        const { key = "" } = event
        if (key === 'Enter') {
            addAnswerOption()
        } else if (key === "Backspace" || key === "Delete") {
            if (memoizedAnswerOptions[index].value.length === 0) {
                deleteItem(index)
            }
        }
    }
    const layoutRef = useRef<HTMLDivElement>(null)
    const optionsRef = useRef<HTMLDivElement[]>([])
    const [currentlyDraggedItem, setCurrentlyDraggedItem] = useState<OptionChoices & { index: number } | null>(null)
    const [dragY, setDragY] = useState(0)

    const moveOptions = (index: number, nextIndex: number) => {
        const temp = swap([...answerOptions], index, nextIndex)
        setAnswerOptions(temp)
    }
    const memoizedAnswerOptions = useMemo(() => answerOptions, [answerOptions]);
    return (
        <div
            ref={layoutRef}
            style={{ cursor: currentlyDraggedItem != null ? "move" : "auto" }}
        >
            {currentlyDraggedItem != null && (
                <DragWrapper
                    layoutRef={layoutRef}
                    cardRefs={optionsRef}
                    draggedItem={currentlyDraggedItem}
                    y={dragY}
                    onDragEnd={() => setCurrentlyDraggedItem(null)}
                    move={moveOptions}
                    staticCard
                >
                    <div
                        style={{ width: "calc(100% + 16px)" }}
                        className='block absolute -left-4 bg-white shadow-md rounded-sm pl-4'
                    >
                        <div className='h-12 flex items-center relative'>
                            <div className='block absolute -left-4 transform rotate-90 cursor-move'>
                                <IconContext.Provider value={{ style: { display: 'flex' } }}>
                                    <div>
                                        <IoEllipsisHorizontalSharp size={17} style={{ marginBottom: "-12px", color: "darkgray" }} />
                                        <IoEllipsisHorizontalSharp size={17} style={{ color: "darkgray" }} />
                                    </div>
                                </IconContext.Provider>
                            </div>
                            <div className='mr-2'>
                                <OptionIcon type={type} />
                            </div>
                            <div className="flex-grow max-w-full">
                                <Input
                                    containerClass='text-sm'
                                    value={currentlyDraggedItem.value}
                                    readOnly
                                    alwaysHighlight={false}
                                />
                            </div>
                            <div className='visible'>
                                <MenuIcon icon={<MdOutlineImage />} />
                            </div>
                            <div className={classNames(answerOptions.length > 1 ? "" : "invisible")}>
                                <MenuIcon icon={<MdClose />} />
                            </div>
                        </div>
                    </div>
                </DragWrapper>
            )}
            {memoizedAnswerOptions.map((item: OptionChoices, index: number) => (
                <div
                    ref={(el: any) => optionsRef.current[index] = el}
                    key={index}
                    className={classNames(
                        selected ? "group" : "",
                        'ml-[-1.5rem] mr-[-1.5rem]'
                    )}
                    style={{ opacity: currentlyDraggedItem?.index == index ? 0 : 1 }}
                >
                    <div className='h-12 flex items-center px-6 relative'>
                        <div
                            className='hidden group-hover:block absolute left-2 transform rotate-90 cursor-move'
                            onMouseDown={(event) => {
                                event.preventDefault()
                                setDragY(event.clientY - (getLayoutY(layoutRef.current as HTMLDivElement) ?? 0) - 24)
                                setCurrentlyDraggedItem({ ...item, index })
                            }}
                        >
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
                                onKeyDown={(e) => handleKeyDown(e, index)}
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
        </div>
    )
}
interface LinearScaleProps {
    selected: boolean
    linearValue: OptionLinears
    setLinearValue: (newValue: OptionLinears) => void
}

function generateNumericOptions(start: number, end: number): ValueLabel[] {
    const numericOptions: ValueLabel[] = [];

    for (let i = start; i <= end; i++) {
        numericOptions.push({
            value: i.toString(),
            label: <div className='ml-2'>{i}</div>,
        });
    }

    return numericOptions;
}
const minNumericOptions: ValueLabel[] = generateNumericOptions(0, 1);
const maxNumericOptions: ValueLabel[] = generateNumericOptions(2, 10)

const LinearScaleAnswer = ({ linearValue, setLinearValue, selected }: LinearScaleProps) => {
    const handleValueChange = (payload: any) => {
        const updatedValue = { ...linearValue, ...payload };
        setLinearValue(updatedValue);
    }
    const postIcon = (
        <div className='absolute right-4'>
            <VscTriangleDown size={12} color="#5f6368" />
        </div>
    );

    const renderInput = (key: string, intValue: ValueLabel, value: string, setValue: (val: string) => void) => (
        <div className="flex text-sm">
            <div className="flex items-center mr-4 text-gray-400 w-5">{intValue.label}</div>
            <div className="w-52 h-12 flex items-center">
                <Input
                    name={key}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Label (Optional)"
                    alwaysHighlight
                />
            </div>
        </div>
    );
    const renderPreview = () => {
        // Create a function to generate a range of numbers
        const generateRange = (start: number, end: number) => {
            const result = [];
            for (let i = start; i <= end; i++) {
                result.push(i);
            }
            return result;
        };

        // Define the range you want to loop through
        const range = generateRange(parseInt(linearValue.min.value), parseInt(linearValue.max.value)); // Start from 2 and end at 11

        const textDiv = (text: string) =>
            <p className='min-w-[32px] max-w-[165px] flex-grow break-words text-center'>
                {text}
            </p>

        return (
            <div className='flex items-center w-full justify-center'>
                {textDiv(linearValue.minLabel)}
                {range.map((number, index) => (
                    <div key={index} className='flex justify-center flex-grow'>
                        <div className='min-w-[32px] max-w-[62px]'>
                            <div className='h-[42px] flex justify-center items-center'>
                                {number}
                            </div>
                            <div className='h-12 flex justify-center items-center'>
                                <MdRadioButtonUnchecked {...iconProps} />
                            </div>
                        </div>
                    </div>
                ))}
                {textDiv(linearValue.maxLabel)}
            </div>
        );
    }
    return (
        selected ? (
            <div className='-mx-2'>
                <div className="p-2 flex items-center">
                    <div className="w-[70px] h-12">
                        <Select
                            borderless
                            value={linearValue.min}
                            onChange={(val) => handleValueChange({ min: val })}
                            options={minNumericOptions}
                            customPostIcon={postIcon}
                            buttonClass='px-2'
                        />
                    </div>
                    <span className='mx-2'>to</span>
                    <div className="w-[70px] h-12">
                        <Select
                            borderless
                            value={linearValue.max}
                            onChange={(val) => handleValueChange({ max: val })}
                            options={maxNumericOptions}
                            customPostIcon={postIcon}
                            buttonClass='px-2'
                        />
                    </div>
                </div>
                {renderInput('min', linearValue.min, linearValue.minLabel, (val) => handleValueChange({ minLabel: val }))}
                {renderInput('max', linearValue.max, linearValue.maxLabel, (val) => handleValueChange({ maxLabel: val }))}
            </div>) :
            // preview card
            renderPreview()
    );
}

interface AnswerProps {
    questionProps: Question
    selected: boolean
    optionsValue: OptionChoices[]
    otherOptionValue: boolean
    setOptionsValue: (newValue: OptionChoices[]) => void,
    setOtherOptionValue: (newValue: boolean) => void,
    linearValue: OptionLinears
    setLinearValue: (newValue: OptionLinears) => void,
}

const AnswerOption = ({ questionProps,
    selected = false,
    setOptionsValue,
    optionsValue,
    otherOptionValue,
    setOtherOptionValue,
    linearValue,
    setLinearValue
}: AnswerProps) => {
    const {
        type,
        moreOptionValues: initialMoreOptions,
    } = questionProps

    const { value } = type
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
    } else if (value == 'linear_scale') {
        content = (<LinearScaleAnswer
            linearValue={linearValue}
            setLinearValue={setLinearValue}
            selected={selected}
        />)
    } else {
        content = (<></>)
    }
    return content
}

export default AnswerOption