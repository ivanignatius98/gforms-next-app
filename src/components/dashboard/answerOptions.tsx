import React, { useEffect, useState, useRef, useMemo } from 'react'
// import Select from '../forms/general-form/select'
import TextAnswer from './textAnswer'
import Input from '@modules/Input'
import { Question } from '@interfaces/question.interface';
import { MdRadioButtonUnchecked, MdClose, MdOutlineImage, MdWarning, } from 'react-icons/md'
import MenuIcon from '@modules/MenuIcon'
import { FiTrash2 } from 'react-icons/fi'
import { IoAddCircleOutline, IoEllipsisHorizontalSharp } from 'react-icons/io5'
import { OptionChoices } from '@interfaces/question.interface';
import { IconContext } from 'react-icons';
import Tooltip from '@modules/Tooltip'


// const ChoiceIcon = ({ type, index, numericIcon }) => {
//     index = index == undefined ? -1 : index
//     let icon = <div style={{ width: 16 }}>{`${index + 1}. `}</div>
//     if (!numericIcon) {
//         switch (type) {
//             case 'multiple_choice':
//             case 'multiple_choice_grid': {
//                 icon = <MdOutlineImage />
//             } break
//             case 'checkboxes': {
//                 icon = <MdOutlineImage />
//             } break
//         }
//     }
//     return icon
// }

// const FileUploader = ({ setItemImage, index }) => {
//     const hiddenFileInput = React.useRef(null);
//     const handleClick = () => {
//         hiddenFileInput.current.click();
//     };
//     return (
//         <React.Fragment>
//             <button
//                 className="btn btn-secondary"
//                 style={{ alignSelf: 'flex-start', marginLeft: 4 }}
//                 onClick={handleClick}
//             >
//                 <i className="p-0 fa fa-file"></i>
//             </button>
//             <input
//                 accept="image/*,video/*"
//                 type="file"
//                 ref={hiddenFileInput}
//                 style={{ display: 'none' }}
//                 value={''}
//                 onChange={({ target }) => {
//                     if (target.files[0] != undefined) {
//                         setItemImage({
//                             image: target.files[0],
//                             previewImage: URL.createObjectURL(target.files[0])
//                         }, index)
//                     }
//                 }}
//             />
//         </React.Fragment>
//     );
// };
// const Choice = ({ item, index, type, setItemValue, setItemImage, removeImage, deleteItem, allowDelete }) => {
//     let imageSource = null
//     if (item.previewImage != undefined && item.previewImage != '') {
//         imageSource = item.previewImage
//     } else if (item.previewImage == undefined && typeof item.image == 'string' && item.image != '') {
//         imageSource = item.image
//     }
//     return (
//         <React.Fragment>
//             <div style={{ paddingBottom: 8, flexDirection: 'row', display: 'flex' }}>
//                 <div className="btn"
//                     style={{
//                         paddingRight: 0,
//                         paddingLeft: 0,
//                     }}
//                 >
//                     <ChoiceIcon type={type} index={index} />
//                 </div>
//                 <div className="col-md-10" style={{
//                     paddingRight: 0, paddingLeft: 0, marginLeft: 8, marginRight: 8
//                 }}>
//                     <div style={{ flexDirection: 'row', display: 'flex' }}>
//                         <div className="col p-0">
//                             <Input
//                                 autoFocus={index != 0}
//                                 value={item.value}
//                                 alwaysHighlight={true}
//                                 error={item.error}
//                                 onChange={({ target }) => {
//                                     setItemValue(target.value, index)
//                                 }}
//                                 // onBlur={({ target }) => {
//                                 //     if (target.value == '' || item.error) {
//                                 //         setItemValue(`Option ${index + 1}`, index)
//                                 //     }
//                                 // }}
//                                 // noMargin={true}
//                                 placeholder={`Option ${index + 1}`}
//                             /></div>
//                         {/* {item.image == '' &&
//                             <FileUploader setItemImage={setItemImage} index={index} />
//                         } */}
//                     </div>
//                 </div>
//                 {JSON.stringify(allowDelete)}
//                 {allowDelete &&
//                     <button className="btn" onClick={() => { deleteItem(index) }}>
//                         <i className="fa fa-trash"></i>
//                     </button>
//                 }
//             </div>
//             {(imageSource != null) &&
//                 <div style={{ flexDirection: 'row', display: 'flex', marginLeft: 32, marginBottom: 8 }}>
//                     <img src={imageSource} style={{
//                         maxHeight: 140, maxWidth: 200
//                     }} className="img-fluid img-thumbnail" />

//                     <button
//                         className="btn btn-secondary"
//                         style={{ alignSelf: 'flex-start', marginLeft: 4 }}
//                         onClick={() => removeImage(index)}
//                     >
//                         <FiTrash2 />
//                     </button>
//                 </div>
//             }
//         </React.Fragment>
//     )
// }
// const GridChoice = ({ item, index, type, setItemValue, deleteItem, label, numericIcon, allowDelete }) => {
//     return (
//         <div style={{ paddingBottom: 8, flexDirection: 'row', display: 'flex' }}>
//             <div className="btn"
//                 style={{
//                     paddingRight: 0,
//                     paddingLeft: 0,
//                 }}
//             >
// <ChoiceIcon numericIcon={numericIcon} type={type} index={index} />
//             </div>
//             <div className="col-md-9" style={{
//                 paddingRight: 0,
//                 paddingLeft: 0,
//                 marginLeft: 8,
//                 marginRight: 8
//             }}>
//                 <Input
//                     alwaysHighlight={true}
//                     autoFocus={true}
//                     value={item.value}
//                     onChange={(e) => {
//                         setItemValue(e.target.value, index)
//                     }}
//                     onBlur={({ target }) => {
//                         if (target.value == '') {
//                             setItemValue(`${label} ${index + 1}`, index)
//                         }
//                     }}
//                     noMargin={true}
//                     placeholder={`${label} ${index + 1}`}
//                 />
//             </div>
//             {allowDelete &&
//                 <button className="btn" style={{ padding: 0 }} onClick={() => { deleteItem(index) }}>
//                     <i className="fa fa-trash"></i>
//                 </button>
//             }
//         </div>
//     )
// }
// const GridChoicesAnswer = ({ type, gridRowOptions, gridColumnOptions, setQuestionValue }) => {
//     const addRow = () => {
//         const temp = [...gridRowOptions]
//         temp.push({ value: `Row ${temp.length + 1}` })
//         setQuestionValue({ gridRowOptions: temp })
//     }
//     const setRowItemValue = (e, index) => {
//         const temp = [...gridRowOptions]
//         temp[index] = { value: e }
//         setQuestionValue({ gridRowOptions: temp })
//     }
//     const deleteRow = (index) => {
//         const temp = [...gridRowOptions]
//         temp.splice(index, 1)
//         setQuestionValue({ gridRowOptions: temp })
//     }
//     const addColumn = () => {
//         const temp = [...gridColumnOptions]
//         temp.push({ value: `Column ${temp.length + 1}` })
//         setQuestionValue({ gridColumnOptions: temp })
//     }
//     const setColumnItemValue = (e, index) => {
//         const temp = [...gridColumnOptions]
//         temp[index] = { value: e }
//         setQuestionValue({ gridColumnOptions: temp })
//     }
//     const deleteColumn = (index) => {
//         const temp = [...gridColumnOptions]
//         temp.splice(index, 1)
//         setQuestionValue({ gridColumnOptions: temp })
//     }
//     return (
//         <React.Fragment>
//             <div className="row">
//                 <div className="col-md-6" >
//                     Rows
//                     {gridRowOptions.map((item, index) =>
//                         <GridChoice
//                             item={item}
//                             key={index}
//                             index={index}
//                             type={type}
//                             numericIcon={true}
//                             setItemValue={setRowItemValue}
//                             deleteItem={deleteRow}
//                             allowDelete={gridRowOptions.length > 1}
//                             label={'Row'}
//                         />
//                     )}
//                     <AddOption type={type} numericIcon={true} index={gridRowOptions.length} addAnswerOption={addRow} label='Add Row' />
//                 </div>
//                 <div className="col-md-6" >
//                     Columns
//                     {gridColumnOptions.map((item, index) =>
//                         <GridChoice
//                             item={item}
//                             key={index}
//                             index={index}
//                             type={type}
//                             setItemValue={setColumnItemValue}
//                             deleteItem={deleteColumn}
//                             allowDelete={gridColumnOptions.length > 1}
//                             label={'Column'}
//                         />
//                     )}
//                     <AddOption type={type} index={gridColumnOptions.length} addAnswerOption={addColumn} label='Add Column' />
//                 </div>
//             </div>
//         </React.Fragment>
//     )
// }

interface AddProps {
    type: string
    label?: string
    // answerOptions: OptionChoices[]
    addOther: boolean
    setOtherOption: (val: boolean) => void
    addAnswerOption: () => void
}
const AddOption = ({ addAnswerOption, setOtherOption, label = 'Add Option', addOther = false }: AddProps) => {
    const containerRef = useRef<HTMLDivElement>(null)
    return (
        <>
            <div ref={containerRef} className="absolute top-0 left-0 pointer-events-none opacity-0">
                {label}
            </div>
            <div className='h-12 flex items-center text-sm group'>
                <div className=''>
                    <MdRadioButtonUnchecked size={21} style={{ color: "darkgray" }} />
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
    answerOptions: OptionChoices[]
    setAnswerOptions: React.Dispatch<React.SetStateAction<OptionChoices[]>>
}
const ChoicesAnswer = ({ type, answerOptions, setAnswerOptions }: ChoiceProps) => {

    const [otherOption, setOtherOption] = useState(false)
    const addAnswerOption = () => {
        setAnswerOptions((prevProps) => {
            const newValue = `Option ${prevProps.length + 1}`
            // const error = newValue != "" && prevProps.filter(row => row.value === newValue).length > 0
            prevProps.push({
                value: newValue,
                //  ,
                image: '', previewImage: ''
            })
            return [...prevProps]
        })
    }
    const setItemValue = (newValue: string, index: number) => {
        setAnswerOptions((prevProps) => {
            // const error = newValue != "" && prevProps.filter(row => row.value === newValue).length > 0

            prevProps[index] = {
                ...prevProps[index], value: newValue,
                // error
            }
            return [...prevProps]
        })
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
    const deleteItem = (index: number) => {
        setAnswerOptions((prevProps) => {
            const newProps = prevProps.slice()
            newProps.splice(index, 1)
            return [...newProps]
        })
    }
    const otherType = type != 'dropdown' && type != 'polling'

    const memoizedAnswerOptions = useMemo(() => answerOptions, [answerOptions]);
    return (
        <>
            {memoizedAnswerOptions.map((item: OptionChoices, index: number) => (
                <div
                    key={index}
                    className='group ml-[-1.5rem] mr-[-1.5rem]'
                >
                    <div className='h-12 flex items-center px-6 relative'>
                        <div className='hidden group-hover:block absolute left-2 z-10 transform rotate-90 cursor-move'>
                            <IconContext.Provider value={{ style: { display: 'flex' } }}>
                                <div>
                                    <IoEllipsisHorizontalSharp size={17} style={{ marginBottom: "-12px", color: "darkgray" }} />
                                    <IoEllipsisHorizontalSharp size={17} style={{ color: "darkgray" }} />
                                </div>
                            </IconContext.Provider>
                        </div>
                        <div className='mr-2'>
                            <MdRadioButtonUnchecked size={21} style={{ color: "darkgray" }} />
                        </div>
                        <div className="flex-grow w-[270px] max-w-full">
                            <Input
                                containerClass='text-sm'
                                autoFocus={index != 0}
                                value={item.value}
                                error={item.error}
                                alwaysHighlight={true}
                                onChange={({ target }) => {
                                    setItemValue(target.value, index)
                                }}
                                // onFocus={() => { setFocused(index) }}
                                onBlur={({ target }) => {
                                    // if (target.value == '' || item.error) {
                                    //     setItemValue(`Option ${index + 1}`, index)
                                    // }
                                    // setFocused(null)
                                }}
                                placeholder={`Option ${index + 1}`}
                            />
                        </div>
                        <div className='hidden group-hover:block group-focus-within:block'>
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
                            <MenuIcon icon={<MdOutlineImage />} />
                        </div>
                        {answerOptions.length > 1 ?
                            <MenuIcon onClick={() => deleteItem(index)} icon={<MdClose />} /> :
                            <div className='w-12'></div>
                        }
                    </div>
                </div>
            ))}
            {otherOption && (
                <div className='h-12 flex items-center group'
                >
                    <div className='mr-2'>
                        <MdRadioButtonUnchecked size={21} style={{ color: "darkgray" }} />
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
                    <MenuIcon
                        onClick={() => setOtherOption(false)}
                        icon={<MdClose />} />
                </div>
            )}
            <AddOption
                type={type}
                addOther={(!otherOption && otherType)}
                // index={answerOptions.length}
                addAnswerOption={addAnswerOption}
                setOtherOption={setOtherOption}
            />
        </>
    )


    // <React.Fragment>
    //     {
    // answerOptions.map((item, index) => {
    //             let imageSource = null
    //             if (item.previewImage != undefined && item.previewImage != '') {
    //                 imageSource = item.previewImage
    //             } else if (item.previewImage == undefined && typeof item.image == 'string' && item.image != '') {
    //                 imageSource = item.image
    //             }
    //             return (
    //                 <React.Fragment key={index}>
    //                     <div className='pb-2 flex'>
    //                         <div className="px-0">
    //                             <ChoiceIcon type={type} index={index} />
    //                         </div>
    //                         <div className="">
    //                             <div >
    //                                 <div className="col p-0">
    //                                     <Input
    //                                         autoFocus={index != 0}
    //                                         value={item.value}
    //                                         alwaysHighlight={true}
    //                                         error={item.error}
    //                                         onChange={({ target }) => {
    //                                             setItemValue(target.value, index)
    //                                         }}
    //                                         // onBlur={({ target }) => {
    //                                         //     if (target.value == '' || item.error) {
    //                                         //         setItemValue(`Option ${index + 1}`, index)
    //                                         //     }
    //                                         // }}
    //                                         // noMargin={true}
    //                                         placeholder={`Option ${index + 1}`}
    //                                     /></div>
    //                                 {/* {item.image == '' &&
    //                                 <FileUploader setItemImage={setItemImage} index={index} />
    //                             } */}
    //                             </div>
    //                         </div>
    //                         {answerOptions.length > 1 &&
    //                             (<>Xasd</>)
    //                             // <button className="btn" onClick={() => { deleteItem(index) }}>
    //                             //     <i className="fa fa-trash"></i>
    //                             // </button>
    //                         }
    //                     </div>
    //                     {/* {(imageSource != null) &&
    //                         <div style={{ flexDirection: 'row', display: 'flex', marginLeft: 32, marginBottom: 8 }}>
    //                             <img src={imageSource} style={{
    //                                 maxHeight: 140, maxWidth: 200
    //                             }} className="img-fluid img-thumbnail" />

    //                             <button
    //                                 className="btn btn-secondary"
    //                                 style={{ alignSelf: 'flex-start', marginLeft: 4 }}
    //                                 onClick={() => removeImage(index)}
    //                             >
    //                                 <FiTrash2 />
    //                             </button>
    //                         </div>
    //                     } */}
    //                 </React.Fragment>)
    // }
    //             // <Choice
    //             //     item={item}
    //             //     key={index}
    //             //     index={index}
    //             //     type={type}
    //             //     setItemValue={setItemValue}
    //             //     setItemImage={setItemImage}
    //             //     deleteItem={deleteItem}
    //             //     removeImage={removeImage}
    //             //     allowDelete={answerOptions.length > 1}
    //             // />
    //         )
    //     }
    //     {(otherOption && otherType) &&
    //         <div style={{ paddingBottom: 8, flexDirection: 'row', display: 'flex' }}>
    //             <div className="btn"
    //                 style={{
    //                     paddingRight: 0,
    //                     paddingLeft: 0,
    //                 }}
    //             >
    //                 {/* <ChoiceIcon type={type} index={-1} /> */}
    //             </div>
    //             <div className="col-md-10" style={{
    //                 paddingRight: 0, paddingLeft: 0, marginLeft: 8, marginRight: 8
    //             }}>
    //                 <Input
    //                     autoFocus={true}
    //                     value={'Other...'}
    //                     noMargin={true}
    //                     disabled={true}
    //                 />
    //             </div>
    //             <button className="btn" onClick={() => {
    //                 setOtherOption(false)
    //             }}>
    //                 <i className="fa fa-trash"></i>
    //             </button>
    //         </div>
    //     }
    // </React.Fragment>
}
// const LinearScaleAnswer = ({ linearValueOptions, setQuestionValue }) => {
//     const min = [
//         { label: "0", value: "0" },
//         { label: "1", value: "1" }
//     ]
//     const max = [
//         { label: "2", value: "2" },
//         { label: "3", value: "3" },
//         { label: "4", value: "4" },
//         { label: "5", value: "5" },
//         { label: "6", value: "6" },
//         { label: "7", value: "7" },
//         { label: "8", value: "8" },
//         { label: "9", value: "9" },
//         { label: "10", value: "10" }
//     ]
//     return (
//         <React.Fragment>
//             <div className="row" style={{ alignItems: 'center', paddingLeft: 15, paddingRight: 15 }}>
//                 <div style={{ width: 64 }} >
//                     <Input
//                         style={{ width: 32 }}
//                         noMargin={true}
//                         component={propChild =>
//                             <Select
//                                 {...propChild}
//                                 name="min"
//                                 value={linearValueOptions.min}
//                                 onChange={(e) => {
//                                     const temp = { ...linearValueOptions, min: e }
//                                     setQuestionValue({ linearValueOptions: temp })
//                                 }}
//                                 isSearchable={false}
//                                 options={min}
//                                 placeholder="Select Type"
//                             />
//                         }
//                     />
//                 </div>
//                 <div style={{ paddingLeft: 8, paddingRight: 8 }}>to</div>
//                 <div style={{ width: 64 }} >
//                     <Input
//                         noMargin={true}
//                         component={propChild =>
//                             <Select
//                                 {...propChild}
//                                 name="max"
//                                 onChange={(e) => {
//                                     const temp = { ...linearValueOptions, max: e }
//                                     setQuestionValue({ linearValueOptions: temp })
//                                 }}
//                                 isSearchable={false}
//                                 value={linearValueOptions.max}
//                                 options={max}
//                                 placeholder="Select Type"
//                             />
//                         }
//                     />
//                 </div>
//             </div>
//             <div className="row" style={{ marginTop: 16, marginBottom: 16, paddingLeft: 15, paddingRight: 15 }}>
//                 <div style={{ width: 16, marginRight: 15, alignSelf: 'center' }}>{linearValueOptions.min.label}</div>
//                 <div className="col-md-5" style={{
//                     paddingRight: 0, paddingLeft: 0
//                 }}>
//                     <Input
//                         alwaysHighlight={true}
//                         autoFocus={true}
//                         value={linearValueOptions.minLabel}
//                         onChange={({ target }) => {
//                             const temp = { ...linearValueOptions, minLabel: target.value }
//                             setQuestionValue({ linearValueOptions: temp })
//                         }}
//                         noMargin={true}
//                         placeholder={"Label (optional)"}
//                     />
//                 </div>
//             </div>
//             <div className="row" style={{ marginTop: 16, marginBottom: 16, paddingLeft: 15, paddingRight: 15 }}>
//                 <div style={{ width: 16, marginRight: 15, alignSelf: 'center' }}>{linearValueOptions.max.label}</div>
//                 <div className="col-md-5"
//                     style={{
//                         paddingRight: 0, paddingLeft: 0
//                     }}>
//                     <Input
//                         alwaysHighlight={true}
//                         value={linearValueOptions.maxLabel}
//                         onChange={({ target }) => {
//                             const temp = { ...linearValueOptions, maxLabel: target.value }
//                             setQuestionValue({ linearValueOptions: temp })
//                         }}
//                         noMargin={true}
//                         placeholder={"Label (optional)"}
//                     />
//                 </div>
//             </div>
//         </React.Fragment>
//     )
// }

interface AnswerProps {
    questionProps: Question
    setQuestionValue: Function
}
const AnswerOption = ({ setQuestionValue, questionProps }: AnswerProps) => {
    const {
        type,
        answerOptions: ans,
        gridRowOptions,
        gridColumnOptions,
        linearValueOptions,
    } = questionProps

    const { value } = type
    const [content, setContent] = useState<JSX.Element | null>(null)
    const [answerOptions, setAnswerOptions] = useState<OptionChoices[]>([...ans])
    useEffect(() => {
        if (value == 'short_answer' || value == 'paragraph' || value == 'date' || value == 'time') {
            setContent(<TextAnswer type={value} />)
        } else if (value == 'multiple_choice') {
            setContent(<ChoicesAnswer
                type={value}
                answerOptions={answerOptions}
                setAnswerOptions={setAnswerOptions}
            />)
        } else if (value == 'checkboxes' || value == 'dropdown') {
            // setContent(<ChoicesAnswer
                // type={value}
                // answerOptions={answerOptions}
                // setAnswerOptions={setAnswerOptions}
            // />)
            setContent(<></>)
        } else {
            setContent(<></>)
        }
        // setQuestionValue(answerOptions)
    }, [value, answerOptions])

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
    return content
}

export default AnswerOption