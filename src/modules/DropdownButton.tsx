import { useEffect, useRef, useState } from 'react';
import Tooltip from './Tooltip'
import Dropdown from './Dropdown'
import { BiDotsVerticalRounded } from 'react-icons/bi';

interface Content {
  icon?: JSX.Element,
  label: string
}
interface ListItem {
  onClick: Function;
  content: Content
}
type Props = {
  dropdownItemData: ListItem[][],
};

const DropdownButton = ({ dropdownItemData }: Props) => {
  const [showTooltip, setShowTooltip] = useState(true)
  return (
    <Tooltip
      orientation="bottom"
      showPointer={false}
      show={showTooltip}
      tooltipText="More options"
    >
      <Dropdown {...{ dropdownItemData }} setOpen={(val: boolean) => setShowTooltip(!val)}>
        <button className="w-12 h-12 flex items-center justify-center hover:bg-slate-100 active:bg-slate-200 rounded-full">
          <BiDotsVerticalRounded size={24} color="#5f6368" />
        </button>
      </Dropdown>
    </Tooltip>
  )
}

export default DropdownButton