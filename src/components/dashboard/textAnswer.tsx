import { classNames } from "@helpers"
import { IoMdCalendar, IoMdTime } from 'react-icons/io'
interface Props {
    type: string
}

const TextAnswer = ({ type }: Props) => {
    const textMap = new Map([
        ["short_answer", {
            content: 'Short Answer Text',
            width: "50%"
        }],
        ["paragraph", {
            content: 'Long Answer Text',
            width: "80%"
        }],
        ["date", {
            content: 'Month, day, year',
            width: 200,
            icon: <IoMdCalendar size={24} color="#a8abad" />
        }],
        ["time", {
            content: 'Time',
            width: 200,
            icon: <IoMdTime size={24} color="#a8abad" />
        }],
    ])
    if (textMap.has(type)) {
        const text = textMap.get(type)
        return (
            <div className="flex">
                <div
                    className={classNames(
                        (type === "date" || type === "time") ? " border-b-slate-200" : " border-b-slate-400 border-dotted",
                        "text-sm text-slate-400 mt-4 pb-1 border-b-[1px] mb-6 text-ellipsis whitespace-nowrap",
                    )}
                    style={{ width: text?.width }}
                >
                    <div className="relative">
                        {text?.content}
                        {text?.icon &&
                            <span className="pt-2 absolute right-0 -bottom-[3px]" >
                                {text?.icon}
                            </span>
                        }
                    </div>
                </div>
            </div>
        )
    }

    return null
}

export default TextAnswer