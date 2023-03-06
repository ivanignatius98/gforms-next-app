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

const DropdownButton = ({ dropdownItemData, viewportHeight }: Props) => {
  const [showTooltip, setShowTooltip] = useState(true)

  const [leftPosition, setLeftPosition] = useState(0);
  const [topPosition, setTopPosition] = useState(48);

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const thresholdWidth = 1300;
      const newPost = screenWidth - thresholdWidth + ((screenWidth - thresholdWidth) * -0.5)
      const newHeight = screenHeight - thresholdWidth + ((screenWidth - thresholdWidth) * -0.5)

      // setTopPosition(0)
      // console.log(screenHeight - (viewportHeight + 230))
      // if (screenHeight < viewportHeight + 230 ) {
      //   setTopPosition(screenHeight - (viewportHeight + 230))
      // } else {
      //   setTopPosition(0)
      // }

      if (newPost <= -248) {
        setLeftPosition(-248)
      } else if (screenWidth < thresholdWidth) {
        setLeftPosition(newPost);
      } else {
        setLeftPosition(0);
      }
    };
    handleResize()

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return (
    <Tooltip
      orientation="bottom"
      showPointer={false}
      show={showTooltip}
      tooltipText="More options"
    >
      <Dropdown
        {...{ dropdownItemData }}
        setOpen={(val: boolean) => setShowTooltip(!val)}
        optionContainerStyle={{ left: leftPosition, top: topPosition }}
        optionContainerClassName=' absolute text-left py-1 z-40 w-80 origin-top-left divide-y divide-gray-200 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5'
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