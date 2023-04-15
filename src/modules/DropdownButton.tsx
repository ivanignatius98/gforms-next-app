import { useEffect, Ref, useState, useCallback, Fragment } from 'react';
import Tooltip from './Tooltip'
import { Listbox, Transition } from '@headlessui/react';
import { SelectItems } from '@interfaces/dropdown.interface';
import { IoMdCheckmark } from 'react-icons/io';
import { classNames } from "@helpers"

type Props = {
  dropdownItemData: SelectItems[],
  cardRef?: HTMLDivElement,
  selected?: boolean,
  optionsHeight: number
  onChange?: (val: string) => void
  value?: string[]
  children: JSX.Element
};

const DropdownButton = ({ children, dropdownItemData, value, onChange = () => { }, optionsHeight, cardRef, selected }: Props) => {
  const [showTooltip, setShowTooltip] = useState(true)
  const [leftPosition, setLeftPosition] = useState(0);
  const [topPosition, setTopPosition] = useState(48);

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

  const setOpen = (val: boolean) => {
    setShowTooltip(!val);
    if (val) { repositionOptions() }
  }
  return (
    <Tooltip
      orientation="bottom"
      showPointer={false}
      show={showTooltip}
      tooltipText="More options"
    >
      <Listbox
        value={value}
        onChange={(value: any) => {
          onChange(value)
        }}
        as="div"
        className="relative inline-block text-left"
        multiple
      >
        <Listbox.Button
          as={Fragment}
        >
          {/* value preview */}
          {children}
        </Listbox.Button>
        <Transition
          as={Fragment}
          beforeEnter={() => { setOpen?.(true) }}
          beforeLeave={() => {
            setOpen?.(false)
          }}
        >
          <Listbox.Options
            as='div'
            style={{ left: leftPosition, top: topPosition }}
            className="absolute text-left py-1 z-40 w-80 origin-top-left divide-y divide-gray-200 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
          >
            {dropdownItemData.map(({ items }, groupIndex) => (
              <div className='py-2' key={groupIndex}>
                {items.map(({ content }, i) =>
                  <Listbox.Option
                    as={Fragment}
                    key={content.value}
                    value={content.value}
                  >
                    {({ selected, active }) => (
                      <button
                        className={classNames(
                          active ? 'bg-blue-50' : '',
                          'flex w-full items-center px-2 py-3 text-sm h-12'
                        )}
                      >
                        <div className="pl-2 pr-4">
                          {selected ?
                            <IoMdCheckmark size={24} color="#5f6368" /> :
                            <div className='w-6'></div>
                          }
                        </div>
                        {content.label}
                      </button>
                    )}
                  </Listbox.Option>
                )}
              </div>
            ))}
          </Listbox.Options>
        </Transition>
      </Listbox >
    </Tooltip>
  )
}

export default DropdownButton