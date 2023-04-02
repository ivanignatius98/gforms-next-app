import React, { useEffect, useState } from 'react'
// import TextInput from '../forms/general-form/textinput'
// import Select from '../forms/general-form/select'
// import ChoiceIcon from './choiceIcon'
import TextAnswer from './textAnswer'

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
//                             <TextInput
//                                 autoFocus={index != 0}
//                                 value={item.value}
//                                 alwaysHighlight={true}
//                                 error={item.error}
//                                 onChange={({ target }) => {
//                                     setItemValue(target.value, index)
//                                 }}
//                                 onBlur={({ target }) => {
//                                     if (target.value == '' || item.error) {
//                                         setItemValue(`Option ${index + 1}`, index)
//                                     }
//                                 }}
//                                 noMargin={true}
//                                 placeholder={`Option ${index + 1}`}
//                             /></div>
//                         {item.image == '' &&
//                             <FileUploader setItemImage={setItemImage} index={index} />
//                         }
//                     </div>
//                 </div>
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
//                         <i className="p-0 fa fa-trash"></i>
//                     </button>
//                 </div>
//             }
//         </React.Fragment>
//     )
// }
// const AddOption = ({ addAnswerOption, type, index, label = 'Add Option', numericIcon, addOther = false, setQuestionValue }) => {
//     return (
//         <div style={{ paddingBottom: 8, flexDirection: 'row', display: 'flex' }}>
//             <div className="btn"
//                 style={{
//                     paddingRight: 0,
//                     paddingLeft: 0,
//                 }}
//             >
//                 <ChoiceIcon numericIcon={numericIcon} type={type} index={index} />
//             </div>
//             <div className="col-md-5"
//                 style={{
//                     paddingRight: 0, paddingLeft: 0, marginLeft: 8, marginRight: 8
//                 }}
//                 onClick={() => { addAnswerOption() }}
//             >
//                 <TextInput
//                     readOnly={true}
//                     noMargin={true}
//                     placeholder={label}
//                 />
//             </div>
//             {addOther && (
//                 <React.Fragment>
//                     <div style={{ alignSelf: 'center' }}>or</div>
//                     <button style={{ padding: 0, marginLeft: 8 }} className="btn btn-link" onClick={() => setQuestionValue({ otherOption: true })} >Add Other</button>
//                 </React.Fragment>
//             )}
//         </div>
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
//                 <ChoiceIcon numericIcon={numericIcon} type={type} index={index} />
//             </div>
//             <div className="col-md-9" style={{
//                 paddingRight: 0,
//                 paddingLeft: 0,
//                 marginLeft: 8,
//                 marginRight: 8
//             }}>
//                 <TextInput
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
// const ChoicesAnswer = ({ type, answerOptions, otherOption, setQuestionValue }) => {
//     const addAnswerOption = () => {
//         const temp = [...answerOptions]
//         const newValue = `Option ${temp.length + 1}`
//         const error = temp.filter(row => row.value === newValue).length > 0
//         temp.push({ value: newValue, error: false, image: '', previewImage: '', error })
//         setQuestionValue({ answerOptions: temp })
//     }
//     const setItemValue = (newValue, index) => {
//         const temp = [...answerOptions]
//         const error = temp.filter(row => row.value === newValue).length > 0
//         temp[index] = { ...temp[index], value: newValue, error }
//         setQuestionValue({ answerOptions: temp })
//     }
//     const setItemImage = (newImage, index) => {
//         const temp = [...answerOptions]
//         temp[index] = { ...temp[index], ...newImage }
//         setQuestionValue({ answerOptions: temp })
//     }
//     const removeImage = (index) => {
//         const temp = [...answerOptions]
//         temp[index] = { ...temp[index], ...{ image: '', previewImage: '' } }
//         setQuestionValue({ answerOptions: temp })
//     }
//     const deleteItem = (index) => {
//         const temp = [...answerOptions]
//         temp.splice(index, 1)
//         setQuestionValue({ answerOptions: temp })
//     }
//     const otherType = type != 'dropdown' && type != 'polling'
//     return (
//         <React.Fragment>
//             {
//                 answerOptions.map((item, index) =>
//                     <Choice
//                         item={item}
//                         key={index}
//                         index={index}
//                         type={type}
//                         setItemValue={setItemValue}
//                         setItemImage={setItemImage}
//                         deleteItem={deleteItem}
//                         removeImage={removeImage}
//                         allowDelete={answerOptions.length > 1}
//                     />
//                 )
//             }
//             {(otherOption && otherType) &&
//                 <div style={{ paddingBottom: 8, flexDirection: 'row', display: 'flex' }}>
//                     <div className="btn"
//                         style={{
//                             paddingRight: 0,
//                             paddingLeft: 0,
//                         }}
//                     >
//                         <ChoiceIcon type={type} index={-1} />
//                     </div>
//                     <div className="col-md-10" style={{
//                         paddingRight: 0, paddingLeft: 0, marginLeft: 8, marginRight: 8
//                     }}>
//                         <TextInput
//                             autoFocus={true}
//                             value={'Other...'}
//                             noMargin={true}
//                             disabled={true}
//                         />
//                     </div>
//                     <button className="btn" onClick={() => { setQuestionValue({ otherOption: false }) }}>
//                         <i className="fa fa-trash"></i>
//                     </button>
//                 </div>
//             }
//             <AddOption
//                 type={type}
//                 addOther={(!otherOption && otherType)}
//                 index={answerOptions.length}
//                 addAnswerOption={addAnswerOption}
//                 setQuestionValue={setQuestionValue}
//             />
//         </React.Fragment>
//     )
// }
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
//                     <TextInput
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
//                     <TextInput
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
//                     <TextInput
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
//                     <TextInput
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

const AnswerOption = ({ setQuestionValue, questionProps }) => {
    const {
        type,
        answerOptions,
        gridRowOptions,
        gridColumnOptions,
        linearValueOptions,
        otherOption
    } = questionProps
    const { value } = type
    const [content, setContent] = useState<JSX.Element | null>(null)

    useEffect(() => {
        if (value == 'short_answer' || value == 'paragraph' || value == 'date' || value == 'time') {
            setContent(<TextAnswer type={value} />)
        } else {
            setContent(null)
        }
    }, [value])
    // else if (value == 'multiple_choices' || value == 'checkboxes' || value == 'dropdown' || value == 'polling') {
    //     content = <ChoicesAnswer
    //         type={value}
    //         answerOptions={answerOptions}
    //         otherOption={otherOption}
    //         setQuestionValue={setQuestionValue} />
    // } else if (value == 'linear_scale') {
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