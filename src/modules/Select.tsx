import { useEffect, useRef, useState } from 'react';
import Dropdown from '@modules/Dropdown';
import { MdOutlinePalette, MdOutlineSmartDisplay, MdOutlineImage } from 'react-icons/md'
import { VscTriangleDown } from 'react-icons/vsc';
import { getLayoutY } from '@helpers'
interface Item {
  icon?: JSX.Element
  label: string
  value: string
}
interface DropdownItem {
  onClick: () => void;
  content: Item
}

type Props = {
  options: Item[][]
  onChange: (val: Item) => void
  value?: Item
  cardRef: any
};

interface ItemMap {
  [key: string]: [number, number];
}
function Select({ options, value, onChange, cardRef }: Props) {
  const [selectY, setSelectY] = useState(0)
  const [selected, setSelected] = useState<Item>(value ?? options[0][0])
  const [mappedOptions, setMappedOptions] = useState<DropdownItem[][]>([])
  const [valuesMap, setValuesMap] = useState<ItemMap>({})
  useEffect(() => {
    const mappedArr = []
    const map: ItemMap = {}
    let [groupIndex, idx] = [0, 0]
    for (let group of options) {
      const arrGroup: DropdownItem[] = [];
      for (let i = 0; i < group.length; i++) {
        arrGroup.push({
          onClick: () => setSelected(group[i]),
          content: group[i]
        });
        const { value } = group[i];
        map[value] = [groupIndex, idx];
        idx++
      }
      mappedArr.push(arrGroup)
      groupIndex++
    }
    setValuesMap(map)
    setMappedOptions(mappedArr)
  }, [options])

  useEffect(() => onChange(selected), [selected])
  const [yScrollOffset, setYScrollOffset] = useState(0)

  const repositionCenter = () => {
    const { innerHeight } = window;
    const currY = getLayoutY(cardRef)
    const [groupIndex, index] = valuesMap[selected.value]

    const [groupDividerHeight, eachOptionHeight] = [16, 48]
    const optionHeight = groupDividerHeight * options.length + eachOptionHeight * Object.keys(valuesMap).length
    const topPosition = 24
    const bottomPosition = innerHeight - optionHeight - 24
    let sidePosition = currY - (groupIndex * groupDividerHeight) - (index * eachOptionHeight)
    let finalPos = sidePosition
    if (window.innerHeight < optionHeight || sidePosition <= topPosition) {
      finalPos = topPosition
    } else if (bottomPosition < sidePosition) {
      finalPos = bottomPosition
    }
    setYScrollOffset((sidePosition - 24) * -1)
    setSelectY(finalPos)
  }
  const contentPlaceholder = (content: any) => {
    return typeof content === 'object' ? (<>
      <div className='mx-2'>
        {content.icon}
      </div>
      {content.label}
    </>)
      : null;
  }

  return (
    <Dropdown
      scrollOffset={yScrollOffset}
      containerStyle={{ top: selectY, overflowY: "auto", maxHeight: "calc(100% - 38px)" }}
      buttonClassName='w-full relative inline-block'
      containerClassName=" fixed z-30 w-60 mt-1 bg-white rounded-md shadow-lg origin-top-center focus:outline-none py-[1px] divide-y origin-center divide-gray-200 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
      dropdownItemData={mappedOptions}
      selected={value?.label || ""}
    >
      <button
        onClick={() => repositionCenter()}
        className='relative text-sm items-center flex h-12 ring-1 ring-slate-300 rounded-sm w-full transition-colors ease-in-out duration-200  active:bg-slate-200'>
        {/* value preview */}
        {value && (<>
          {contentPlaceholder(value)}
          <div className='absolute right-2'>
            <VscTriangleDown size={12} color="#5f6368" />
          </div>
        </>)}
      </button>
    </Dropdown >
  )
}

export default Select