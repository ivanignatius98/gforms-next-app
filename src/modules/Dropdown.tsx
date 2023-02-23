import { Menu, Transition } from '@headlessui/react'
import { Fragment, useEffect, useRef, useState, isValidElement } from 'react'
import { BiUndo, BiRedo, BiDotsVerticalRounded } from 'react-icons/bi';

interface ListItem {
  onClick: Function;
  content: string | { icon: JSX.Element, text: string };
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
  buttonClassName?: string
};
export default function Dropdown({ children, dropdownItemData, containerClassName, buttonClassName }: Props) {
  return (
    <Menu as="div" className={buttonClassName || "relative inline-block text-left z-10"}>
      {({ open }) => (
        <>
          <Menu.Button as={Fragment}>
            {children}
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items
              // className="fixed z-10 w-64 p-2 mt-1 bg-white rounded-md shadow-lg origin-top-center focus:outline-none"
              style={{ transform: 'translate(0, -50%)' }}
              className={containerClassName || "absolute z-30 py-1 right-0 w-48 origin-top-right divide-y divide-gray-200 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 "}
            >
              {dropdownItemData.map((items: ListItem[], groupIndex) => (
                <div className='py-2' key={groupIndex}>
                  {items.map(({ onClick, content }: ListItem, i) => (
                    <Menu.Item key={i}>
                      {({ active }) => (
                        <button className={`${active ? 'bg-gray-100 dark:bg-gray-600 dark:text-white' : ''} flex w-full items-center px-2 py-3 text-sm`}
                          onClick={() => { onClick() }}
                        >
                          {typeof content == "string" ?
                            <div className='pl-3'>
                              {content}
                            </div> :
                            <>
                              <div className="pl-2 pr-4">
                                {content.icon}
                              </div>
                              {content.text}
                            </>
                          }
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
