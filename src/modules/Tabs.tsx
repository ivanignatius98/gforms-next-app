import { useState } from "react"
import { setTab } from '@store/tab/action'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

type Props = {
  tabItemData: string[],
  tabIndex: number,
  setTab: Function
};
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}
function Tabs({ tabItemData, ...props }: Props) {
  return (
    <div className="relative pb-5 border-b border-gray-200 sm:pb-0 z-0">
      <div className="mt-4">
        <nav className=" flex space-x-4 justify-center">
          {tabItemData?.map((tab, i) => (
            <button
              key={tab}
              onClick={() => { props.setTab(i) }}
              className={classNames(
                i == props.tabIndex
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

const mapStateToProps = (state: any) => ({
  tabIndex: state.tab.tabIndex,
})
const mapDispatchToProps = (dispatch: any) => {
  return { setTab: bindActionCreators(setTab, dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(Tabs)