import { useEffect, Ref, useState, useCallback } from 'react';
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
  cardRef?: HTMLDivElement,
  selected?: boolean,

};

const DropdownButton = ({ dropdownItemData, cardRef, selected }: Props) => {
  const [showTooltip, setShowTooltip] = useState(true)
  const [leftPosition, setLeftPosition] = useState(0);
  const [topPosition, setTopPosition] = useState(48);
  const [optionsHeight, setOptionsHeight] = useState(100);

  const repositionOptions = useCallback(() => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const thresholdWidth = 1300;
    const newPost = screenWidth - thresholdWidth + ((screenWidth - thresholdWidth) * -0.5)

    // set y position
    if (selected && cardRef != undefined) {
      const currentY = cardRef.getBoundingClientRect().bottom + optionsHeight
      if (screenHeight < (currentY + 24)) {
        setTopPosition(screenHeight - (currentY - 24))
      } else {
        setTopPosition(48)
      }
    }

    // set x position
    if (newPost <= -248) {
      setLeftPosition(-248)
    } else if (screenWidth < thresholdWidth) {
      setLeftPosition(newPost);
    } else {
      setLeftPosition(0);
    }
  }, [cardRef, selected, optionsHeight])

  useEffect(() => {
    repositionOptions()
    window.addEventListener('resize', repositionOptions);
    return () => {
      window.removeEventListener('resize', repositionOptions);
    };
  }, [repositionOptions]);
  return (
    <Tooltip
      orientation="bottom"
      showPointer={false}
      show={showTooltip}
      tooltipText="More options"
    >
      <Dropdown
        {...{ dropdownItemData }}
        transition={{
          enter: "transition duration-200",
          enterFrom: "transform opacity-0 scale-y-50",
          enterTo: "transform opacity-100 scale-y-100"
        }}
        setOptionsHeight={(val: number) => { setOptionsHeight(val) }}
        setOpen={(val: boolean) => {
          setShowTooltip(!val);
          if (val) { repositionOptions() }
        }}
        optionContainerStyle={{ left: leftPosition, top: topPosition }}
        optionContainerClassName='absolute text-left py-1 z-40 w-80 origin-top-left divide-y divide-gray-200 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5'
        containerClassName=" relative inline-block text-left"
      >
        <button className="w-12 h-12 flex items-center justify-center hover:bg-slate-100 active:bg-slate-200 rounded-full">
          <BiDotsVerticalRounded size={24} color="#5f6368" />
        </button>
      </Dropdown>
    </Tooltip>
  )
}

export default DropdownButton