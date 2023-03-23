
import { MdLinearScale, MdCheckBox, MdOutlineImage, MdOutlineShortText } from 'react-icons/md'
import { AiOutlineAlignLeft } from 'react-icons/ai'
import { BsCircleFill, BsFillGrid3X3GapFill, BsGrid3X3GapFill } from 'react-icons/bs'
import { VscTriangleDown } from 'react-icons/vsc';
import { IoMdCloudUpload, IoMdTime, IoMdCalendar } from 'react-icons/io';

interface Item {
  icon?: JSX.Element
  label: string
  value: string
  group?: number
}

interface ItemMap {
  [key: string]: string[];
}
export const additionalOptionsMap: ItemMap = {
  "short_answer": ["description", "response_validation"],
  "paragraph": ["description", "response_validation"],
  "multiple_choice": ["description", "go_to_section", "shuffle_options"],
  "checkboxes": ["description", "response_validation", "shuffle_options"],
  "dropdown": ["description", "go_to_section", "shuffle_options"],
  "file_upload": ["description",],
  "linear_scale": ["description",],
  "multiple_choice_grid": ["description", "limit_per_columns", "shuffle_row"],
  "checkbox_grid": ["description", "limit_per_columns", "shuffle_row"],
  "date": ["description", "time", "year"],
  "time": ["description", "time", "duration"],
}

export const choicesData: Item[] = [{
  icon: <MdOutlineShortText size={24} color="#5f6368" />,
  value: "short_answer",
  label: "Short answer",
  group: 0
}, {
  icon: <AiOutlineAlignLeft size={24} color="#5f6368" />,
  value: "paragraph",
  label: "Paragraph",
  group: 0
}, {
  icon: <div style={{ borderColor: "#5f6368" }} className='m-[2px] border-[2.5px] rounded-full p-[3px]'>
    <BsCircleFill size={10} color="#5f6368" />
  </div>,
  value: "multiple_choice",
  label: "Multiple Choice",
  group: 1
}, {
  icon: <MdCheckBox size={24} color="#5f6368" />,
  value: "checkboxes",
  label: "Checkboxes",
  group: 1
}, {
  icon:
    <div style={{ backgroundColor: "#5f6368" }} className='rounded-full m-[2px] p-[5px]'>
      <VscTriangleDown size={10} color="white" />
    </div>,
  value: "dropdown",
  label: "Dropdown",
  group: 1
}, {
  icon: <IoMdCloudUpload size={24} color="#5f6368" />,
  value: "file_upload",
  label: "File upload",
  group: 2
}, {
  icon: <MdLinearScale size={24} color="#5f6368" />,
  value: "linear_scale",
  label: "Linear scale",
  group: 3
}, {
  icon: <BsFillGrid3X3GapFill size={24} color="#5f6368" />,
  value: "multiple_choice_grid",
  label: "Multiple choice grid",
  group: 3
}, {
  icon: <BsGrid3X3GapFill size={24} color="#5f6368" />,
  value: "checkbox_grid",
  label: "Checkbox grid",
  group: 3
}, {
  icon: <IoMdCalendar size={24} color="#5f6368" />,
  value: "date",
  label: "Date",
  group: 4
}, {
  icon: <IoMdTime size={24} color="#5f6368" />,
  value: "time",
  label: "Time",
  group: 4
}]

export const moreOptionsArr: Item[] = [
  {
    value: "description",
    label: "Desription",
    group: 0
  },
  {
    value: "response_validation",
    label: "Response validation",
    group: 0
  },
  {
    value: "go_to_section",
    label: "Go to section based on answer",
    group: 0
  },
  {
    value: "shuffle_options",
    label: "Shuffle option order",
    group: 1
  },
  {
    value: "limit_per_columns",
    label: "Limit to one response per column",
    group: 1
  },
  {
    value: "shuffle_row",
    label: "Shuffle row order",
    group: 1
  },
  {
    value: "time",
    label: "Include time",
    group: 1
  },
  {
    value: "year",
    label: "Include year",
    group: 1
  },
  {
    value: "duration",
    label: "Duration",
    group: 1
  }
]
export const defaultQuestion = {
  title: '',
  type: choicesData[2],
  answerOptions: [{ value: 'Option 1', error: false, image: '', previewImage: '' }],
  gridRowOptions: [{ value: 'Row 1' }],
  gridColumnOptions: [{ value: 'Column 1' }],
  linearValueOptions: {
    min: { label: "1", value: "1" },
    max: { label: "5", value: "5" },
    minLabel: '',
    maxLabel: ''
  },
  image: '',
  previewImage: '',
  imageAlignment: 'left',
  moreOptions: {
    description: false,
    go_to_section: false,
    shuffle_options: false
  },
}
