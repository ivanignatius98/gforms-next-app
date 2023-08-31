import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react'
import TextAnswer from './textAnswer'
import Input from '@modules/Input'
import { Question } from '@interfaces/question.interface';
import { MdRadioButtonUnchecked, MdCheckBoxOutlineBlank, MdClose, MdOutlineImage, MdWarning, } from 'react-icons/md'
import MenuIcon from '@modules/MenuIcon'
import { IoEllipsisHorizontalSharp } from 'react-icons/io5'
import { OptionChoices } from '@interfaces/question.interface';
import { IconContext } from 'react-icons';
import Tooltip from '@modules/Tooltip'
import { classNames, getLayoutY, swap } from '@helpers';
import Select from '@modules/Select'
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
    const cardHeight = 48
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
    const layoutRef = useRef<HTMLDivElement>(null)
    const optionsRef = useRef<HTMLDivElement[]>([])
    const [currentlyDraggedItem, setCurrentlyDraggedItem] = useState<OptionChoices | null>(null)
    const [dragY, setDragY] = useState(0)
    const [drag, setDrag] = useState<dragProp>(defaultDragState)
    const handleDragEnd = useCallback(() => {
        setDrag((prevDrag) => {
            // seFtCardClick({ cardIndex: prevDrag.current, divClickedOrigin: false })
            // setItemXid(questions[prevDraFg.current ?? 0].xid)
            return defaultDragState
        })
    }, [answerOptions])
    const handleDragChange = (nextIndex: number, index: number | null) => {
        setDrag(() => {
            const dragCurrent = nextIndex
            const isLastCard = dragCurrent >= answerOptions.length - 1
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
            if (nextIndex >= 0 && nextIndex < answerOptions.length && index !== drag.prev) {
                const temp = swap([...answerOptions], index, nextIndex)
                setAnswerOptions(temp)
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
            const nextY = getLayoutY(optionsRef.current[drag.current + 1]) + 18
            if (yCoordinate > nextY) {
                move(drag.current, "down")
            }
        }
        if (!drag.isFirstCard) {
            const prevY = getLayoutY(optionsRef.current[drag.current - 1]) + 24
            if (yCoordinate < prevY) {
                move(drag.current, "up")
            }
        }

        const newCoord = yCoordinate - (getLayoutY(layoutRef.current as HTMLDivElement) ?? 0) - 16
        if (newCoord > 0 && newCoord < (cardHeight * (memoizedAnswerOptions.length - 1))) {
            setDragY(newCoord)
        }
    }, [drag, answerOptions])

    useEffect(() => {
        if (drag.current != null) {
            window.addEventListener('mouseup', handleDragEnd, { passive: true })
            window.addEventListener('mousemove', handleDragging, { passive: true })
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
        const lastCardRect = getLayoutY(optionsRef.current[answerOptions.length - 1])
        if (y - offset < lastCardRect && offset < bottomBreakpoint) {
            window.scrollTo(0, window.scrollY + getScrollSpeed(offset))
        } else if (y < bottomBreakpoint) {
            window.scrollTo(0, window.scrollY - getScrollSpeed(y))
        }
    }
    //#endregion

    const memoizedAnswerOptions = useMemo(() => answerOptions, [answerOptions]);
    return (
        <div
            ref={layoutRef}
            style={{ cursor: drag.current != null ? "move" : "auto" }}
            onMouseMove={handleMouseMove}
        >
            {drag.current != null && currentlyDraggedItem != null && (
                <div className='relative'>
                    <div
                        style={{ top: dragY }}
                        className='absolute z-20 w-full opacity-50 transition-all duration-[5ms] '
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
                    </div>
                </div>
            )}
            {memoizedAnswerOptions.map((item: OptionChoices, index: number) => (
                <div
                    ref={(el: any) => optionsRef.current[index] = el}
                    key={index}
                    className={classNames(
                        selected ? "group" : "",
                        'ml-[-1.5rem] mr-[-1.5rem]'
                    )}
                    style={{ opacity: drag.current == index ? 0 : 1, }}
                >
                    <div className='h-12 flex items-center px-6 relative'>
                        <div
                            className='hidden group-hover:block absolute left-2 transform rotate-90 cursor-move'
                            onMouseDown={(event) => {
                                event.preventDefault()
                                setCurrentlyDraggedItem(item)
                                handleDragChange(index, null)
                                setDragY(event.clientY - (getLayoutY(layoutRef.current as HTMLDivElement) ?? 0) - 24)
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