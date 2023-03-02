
import { MdLinearScale, MdCheckBox, MdOutlineImage, MdOutlineShortText } from 'react-icons/md'
import { AiOutlineAlignLeft } from 'react-icons/ai'
import { BsCircleFill, BsFillGrid3X3GapFill, BsGrid3X3GapFill } from 'react-icons/bs'
import { VscTriangleDown } from 'react-icons/vsc';
import { IoMdCloudUpload, IoMdTime, IoMdCalendar } from 'react-icons/io';

interface Item {
  icon: JSX.Element
  label: string
  value: string
}

export const choicesData: Item[][] = [
  [{
    icon: <MdOutlineShortText size={24} color="#5f6368" />,
    value: "short_answer",
    label: "Short answer"
  }, {
    icon: <AiOutlineAlignLeft size={24} color="#5f6368" />,
    value: "paragraph",
    label: "Paragraph"
  }],
  [{
    icon:
      <div style={{ borderColor: "#5f6368" }} className='m-[2px] border-[2.5px] rounded-full p-[3px]'>
        <BsCircleFill size={10} color="#5f6368" />
      </div>,
    value: "multiple_choices",
    label: "Multiple Choices"

  }, {
    icon: <MdCheckBox size={24} color="#5f6368" />,
    value: "checkboxes",
    label: "Checkboxes"

  }, {
    icon:
      <div style={{ backgroundColor: "#5f6368" }} className='rounded-full m-[2px] p-[5px]'>
        <VscTriangleDown size={10} color="white" />
      </div>,
    value: "dropdown",
    label: "Dropdown"
  }],
  [{
    icon: <IoMdCloudUpload size={24} color="#5f6368" />,
    value: "file_upload",
    label: "File upload"
  }],
  [{
    icon: <MdLinearScale size={24} color="#5f6368" />,
    value: "linear_scale",
    label: "Linear scale"
  }, {
    icon: <BsFillGrid3X3GapFill size={24} color="#5f6368" />,
    value: "multiple_choice_grid",
    label: "Multiple choice grid"
  }, {
    icon: <BsGrid3X3GapFill size={24} color="#5f6368" />,
    value: "checkbox_grid",
    label: "Checkbox grid"
  }],
  [{
    icon: <IoMdCalendar size={24} color="#5f6368" />,
    value: "date",
    label: "Date"
  }, {
    icon: <IoMdTime size={24} color="#5f6368" />,
    value: "time",
    label: "Time"
  }]
]
export const defaultQuestion = {
  title: '',
  type: choicesData[1][0],
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
  otherOption: false,
  shuffleOption: false,
  requireEachRow: false
}
