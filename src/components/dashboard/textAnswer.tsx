interface Props {
    type: string
}

interface Content {
    content: string
    width: number
}
interface Opt {
    [key: string]: Content;
}
const TextAnswer = ({ type }: Props) => {
    const texts: Opt = {
        short_answer: {
            content: 'Short Answer Text',
            width: 50
        },
        paragraph: {
            content: 'Long Answer Text',
            width: 80
        },
        // date: {
        //     content: 'Month, day, year',
        //     width: 50
        // },
        // time: {
        //     content: 'Time',
        //     width: 50
        // },
    }
    return (
        texts[type] &&
        <div
            className="text-sm text-slate-400 mt-4 pb-1 border-b-[1px] border-b-slate-400 border-dotted mb-6"
            style={{ width: texts[type].width + "%" }}
        >
            {texts[type].content}
        </div>
    )
}

export default TextAnswer