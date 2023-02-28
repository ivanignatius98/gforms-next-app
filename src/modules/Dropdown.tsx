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
  buttonClassName?: string,
  containerStyle?: object,
  selected?: string,
  setOpen?: (val: boolean) => void
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}
export default function Dropdown({ children, setOpen, selected, containerStyle = {}, dropdownItemData, containerClassName, buttonClassName }: Props) {
  const [lastActive, setLastActive] = useState([-1, -1])
  interface OptionParams {
    active: boolean
    content: Content
    index: number
    groupIndex: number
  }

  const getOptionClass = ({ active, content, index, groupIndex }: OptionParams) => {
    if (active) {
      // setLastActive([index, groupIndex])
    }
    const [idx, grIdx] = lastActive
    return classNames(
      active && selected == content.label ? "bg-blue-50" :
        active || (idx == index && grIdx == groupIndex) ? 'bg-gray-200' :
          selected == content.label ? 'bg-blue-100' : '',
      "flex w-full items-center px-2 py-3 text-sm"
    )
  }

  return (
    <Menu as="div" className={buttonClassName || "relative inline-block text-left z-10"}>
      {({ open }) => (
        <>
          <Menu.Button as={Fragment}>
            {children}
          </Menu.Button>
          <Transition
            as={Fragment}
            afterEnter={() => setOpen?.(true)}
            afterLeave={() => setOpen?.(false)}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items
              style={containerStyle}
              className={containerClassName || "absolute z-30 py-1 right-0 w-48 origin-top-right divide-y divide-gray-200 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 "}
            >
              {dropdownItemData.map((items: ListItem[], groupIndex) => (
                <div className='py-2' key={groupIndex}>
                  {items.map(({ onClick, content }: ListItem, i) => (
                    <Menu.Item key={i}>
                      {({ active }) => (
                        <button
                          className={getOptionClass({ active, content, index: i, groupIndex })}
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
        </>
      )}
    </Menu >
  )
}
