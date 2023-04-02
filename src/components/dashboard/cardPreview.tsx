import React from 'react'
import ChoiceIcon from './choiceIcon'
import TextAnswer from './textAnswer'

const CardPreview = ({ answerProps }) => {
    const {
        type,
        answerOptions,
        gridRowOptions,
        gridColumnOptions,
        linearValueOptions,
        otherOption
    } = answerProps

    let preview
    switch (type.value) {
        case 'linear_scale': {
            preview = <LinearPreview options={linearValueOptions} />
        } break
        case 'multiple_choices':
        case 'checkboxes':
        case 'dropdown':
        case 'polling': {
            preview = <MultipleChoicePreview type={type.value} options={answerOptions} otherOption={otherOption} />
        } break
        case 'open_question':
        case 'date':
        case 'time': {
            preview = <TextAnswer type={type.value} />
        } break
        case 'multiple_choice_grid': {
            preview = <GridPreview type={type.value} gridRowOptions={gridRowOptions} gridColumnOptions={gridColumnOptions} />
        } break
    }
    return <div>{preview}</div>
}
const GridPreview = ({ type, gridRowOptions, gridColumnOptions }) => {
    return (
        <React.Fragment>
            <div className="row" style={{ justifyContent: 'flex-end' }}>
                <div className="col"></div>
                {gridColumnOptions.map((col, idx) => (
                    <div className="col text-center" key={idx}>
                        {col.value}
                    </div>
                ))}
            </div>
            {gridRowOptions.map((item, index) => (
                <div className="row"
                    style={{
                        height: "calc(1.5em + 1.3rem + 2px)",
                        alignItems: 'center',
                        marginTop: 8,
                        marginBottom: 8
                    }}
                    key={index}
                >
                    <div className="col">
                        {item.value}
                    </div>
                    {gridColumnOptions.map((col, idx) => (
                        <div className="col text-center" key={idx}>
                            <ChoiceIcon type={type} index={index} />
                        </div>
                    ))}
                </div>
            ))
            }
        </React.Fragment>
    )
}
const MultipleChoicePreview = ({ options, type, otherOption }) => {
    const otherType = type != 'dropdown' && type != 'polling'
    return (
        <React.Fragment>
            {options.map((item, index) => {
                let imageSource = null
                if (item.previewImage != undefined && item.previewImage != '') {
                    imageSource = item.previewImage
                } else if (item.previewImage == undefined && typeof item.image == 'string' && item.image != '') {
                    imageSource = item.image
                }
                return (
                    <React.Fragment key={index}>
                        <div className="row" style={{
                            height: "calc(1.5em + 1.3rem + 2px)",
                            alignItems: 'center',
                            paddingLeft: 15,
                            paddingRight: 15,
                            marginTop: 8,
                            marginBottom: 8
                        }}>
                            <ChoiceIcon type={type} index={index} />
                            <div style={{ marginLeft: 8 }}>
                                {item.value}
                            </div>
                        </div>
                        {imageSource != null &&
                            <div style={{ flexDirection: 'row', display: 'flex', marginLeft: 32, marginBottom: 8 }}>
                                <img src={imageSource} style={{
                                    maxHeight: 140, maxWidth: 200
                                }} className="img-fluid img-thumbnail" />
                            </div>
                        }
                    </React.Fragment>
                )

            })}
            {(otherOption && otherType) &&
                <div className="row" style={{
                    height: "calc(1.5em + 1.3rem + 2px)",
                    alignItems: 'center',
                    paddingLeft: 15,
                    paddingRight: 15,
                    marginTop: 8,
                    marginBottom: 8
                }} >
                    <ChoiceIcon type={type} index={options.length - 1} />
                    <div style={{ marginLeft: 8 }}>
                        Other...
                    </div>
                </div>}
        </React.Fragment>
    )
}
const LinearPreview = ({ options }) => {
    let checkboxes = []
    for (let i = options.min.value; i <= options.max.value; i++) {
        checkboxes.push(i)
    }
    return (
        <div className="row" style={{ alignItems: 'flex-end' }}>
            <div className="col text-center">
                {options.minLabel}
            </div>
            {
                checkboxes.map((item, index) => (
                    <div
                        className="col"
                        key={index}
                        style={{
                            paddingRight: 0,
                            paddingLeft: 0,
                        }}
                    >
                        <div className="row text-center" style={{ marginBottom: 8 }}>
                            <div className="col">{item}</div>
                        </div>
                        <div className="row text-center">
                            <div className="col">
                                <i className="fa fa-circle"></i>
                            </div>
                        </div>
                    </div>
                ))
            }
            <div className="col text-center">
                {options.maxLabel}
            </div>
        </div>
    )
}
export default CardPreview