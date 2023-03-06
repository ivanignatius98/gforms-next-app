import { Menu, Transition } from '@headlessui/react'
import React, { Fragment, useEffect, useCallback, useRef, useState, isValidElement } from 'react'
import { BiUndo, BiRedo, BiDotsVerticalRounded } from 'react-icons/bi';

interface Content {
  icon?: JSX.Element,
  label: string
}
interface ListItem {
  onClick: Function;
  content: Content
}
type Props = {
  children?: JSX.Element,
  dropdownItemData: ListItem[][],
  tooltipText?: string,
  orientation?: string,
  showPointer?: boolean,
  show?: boolean,
  showTooltip?: boolean,
  containerClassName?: string,
  optionContainerClassName?: string,
  optionContainerStyle?: object,
  selected?: string,
  setOpen?: (val: boolean) => void,
  scrollOffset?: number,
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}
export default function Dropdown({ children, scrollOffset, setOpen, selected, optionContainerStyle = {}, dropdownItemData, containerClassName, optionContainerClassName }: Props) {
  const [lastActive, setLastActive] = useState([-1, -1])

  interface OptionParams {
    active: boolean
    content: Content
    index: number
    groupIndex: number
  }

  const getOptionClass = ({ active, content, index, groupIndex }: OptionParams) => {
    const [idx, grIdx] = lastActive
    let classStr = ""
    if (selected == content.label) {
      classStr = "bg-blue-100"
      if (active) {
        classStr = "bg-blue-50"
      }
    } else if (active || idx == index && grIdx == groupIndex) {
      classStr = "bg-gray-200"
    }

    return classNames(
      classStr,
      "flex w-full items-center px-2 py-3 text-sm"
    )
  }
  const ref = useRef(null)
  return (
    <Menu as="div" className={containerClassName || "relative inline-block text-left"} >
      {<>
        <Menu.Button as={Fragment}>
          {children}
        </Menu.Button>
        <Transition
          as={Fragment}
          beforeEnter={() => {
            (ref.current as unknown as { scrollTop: number }).scrollTop = scrollOffset ?? 0;
          }}
          afterEnter={() => setOpen?.(true)}
          afterLeave={() => {
            setOpen?.(false)
            setLastActive([-1, -1])
          }}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items
            ref={ref}
            style={optionContainerStyle}
            className={optionContainerClassName || "absolute py-1 z-40 right-0 w-48 origin-top-right divide-y divide-gray-200 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 "}
          >
            {dropdownItemData.map((items: ListItem[], groupIndex) => (
              <div className='py-2' key={groupIndex}>
                <div className=' text-slate-600 text-sm px-4'> Show</div>
                {items.map(({ onClick, content }: ListItem, i) => (
                  <Menu.Item key={i}>
                    {({ active, close }) => (
                      <button
                        onMouseEnter={() => { setLastActive([i, groupIndex]) }}
                        className={"text-left " + getOptionClass({ active, content, index: i, groupIndex })}
                        onClick={() => { onClick() }}
                      >
                        <div className="pl-2 pr-4">
                          {content.icon}
                        </div>
                        {content.label}
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </div>
            ))}
          </Menu.Items>
        </Transition>
      </>}
    </Menu >
  )
}
