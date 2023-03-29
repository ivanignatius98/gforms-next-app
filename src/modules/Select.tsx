import { useEffect, useRef, useState } from 'react';
import Dropdown from '@modules/Dropdown';
import { MdOutlinePalette, MdOutlineSmartDisplay, MdOutlineImage } from 'react-icons/md'
import { VscTriangleDown } from 'react-icons/vsc';
import { getLayoutY } from '@helpers'
interface Item {
  icon?: JSX.Element
  label: string
  value: string,
  group?: number
}
interface DropdownItem {
  onClick: () => void;
  content: Item
}

type Props = {
  options?: Item[]
  onChange?: (val: Item) => void
  value?: Item
  cardRef?: any
};


interface DropdownItemsList {
  header?: string
  items: DropdownItem[]
}
interface ItemMap {
  [key: string]: [number, number];
}
function Select({ options = [], value, onChange = () => { }, cardRef }: Props) {
  const [selectY, setSelectY] = useState(0)
  const [selected, setSelected] = useState<Item>(value ?? options[0])
  const [mappedOptions, setMappedOptions] = useState<DropdownItemsList[]>([])
  const [valuesMap, setValuesMap] = useState<ItemMap>({})
  useEffect(() => {
    const map: ItemMap = {}
    const arrGroup: DropdownItemsList[] = [];

    options.forEach(({ group = 0, ...itemWithoutGroup }, index) => {
      const itemObject = {
        onClick: () => setSelected(itemWithoutGroup),
        content: itemWithoutGroup
      }
      if (!arrGroup[group]) {
        arrGroup[group] = { items: [itemObject] }
      } else {
        arrGroup[group].items.push(itemObject);
      }
      map[itemWithoutGroup.value] = [group, index];
    })
    setValuesMap(map)
    setMappedOptions(arrGroup)
  }, [options])

  useEffect(() => onChange(selected), [selected])
  const [yScrollOffset, setYScrollOffset] = useState(0)

  const repositionCenter = () => {
    const currY = getLayoutY(cardRef)
    const { innerHeight } = window
    const [groupIndex, index] = valuesMap[selected.value]

    const [groupDividerHeight, eachOptionHeight] = [16, 48]
    // const optionHeight = groupDividerHeight * options.length + eachOptionHeight * Object.keys(valuesMap).length
    const optionHeight = 614
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
    setSelectY(finalPos + 8)
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
      optionContainerStyle={{ top: selectY, overflowY: "auto", maxHeight: "calc(100% - 38px)" }}
      containerClassName='w-full relative inline-block'
      optionContainerClassName=" fixed z-30 w-60 mt-1 bg-white rounded-md shadow-lg origin-top-center focus:outline-none py-[1px] divide-y origin-center divide-gray-200 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
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