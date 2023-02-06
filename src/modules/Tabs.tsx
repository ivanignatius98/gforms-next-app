import { useState } from "react"

type Props = {
  tabItemData: string[],
  currentTab: string,
  setCurrentTab: Function
};
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}
export default function Tabs({ tabItemData, currentTab, setCurrentTab }: Props) {
  return (
    <div className="relative pb-5 border-b border-gray-200 sm:pb-0">
      <div className="mt-4">
        <nav className=" flex space-x-4 justify-center">
          {tabItemData?.map((tab) => (
            <button
              key={tab}
              onClick={() => { setCurrentTab(tab) }}
              className={classNames(
                tab == currentTab
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'whitespace-nowrap pb-2 border-b-2 font-medium text-sm'
              )}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
}
