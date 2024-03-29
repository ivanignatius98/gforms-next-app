import { useEffect, useRef, Fragment, useState } from 'react';
import { VscTriangleDown } from 'react-icons/vsc';
import { Listbox, Transition } from '@headlessui/react';
import { getLayoutY } from '@helpers'
import { Content, Item } from '@interfaces/dropdown.interface';
import { classNames } from '@helpers';

interface SelectItem {
  header?: string
  items: Item[]
}
type Props = {
  options?: Item[]
  onChange?: (val: Item) => void
  value?: Item
  groupDividerHeight?: number
  eachOptionHeight?: number
  containerMargins?: number
  borderless?: boolean
  buttonClass?: string
  customPostIcon?: JSX.Element
};

interface ItemMap {
  [key: string]: [number, number];
}

function Select({
  options = [],
  value,
  onChange = () => { },
  groupDividerHeight = 16,
  eachOptionHeight = 48,
  containerMargins = 2,
  borderless = false,
  buttonClass = "",
  customPostIcon
}: Props) {
  const [selectY, setSelectY] = useState(0)
  const [mappedOptions, setMappedOptions] = useState<SelectItem[]>([])
  const [valuesMap, setValuesMap] = useState<ItemMap>({})
  const [optionsHeight, setOptionsHeight] = useState(0)

  useEffect(() => {
    const map: ItemMap = {}
    const arrGroup: SelectItem[] = [];
    let [optHeight, groupCount, prevGroup] = [containerMargins, 1, 0]
    options.forEach(({ group = 0, ...itemWithoutGroup }, index) => {
      const itemObject = itemWithoutGroup
      if (!arrGroup[group]) {
        arrGroup[group] = { items: [itemObject] }
      } else {
        arrGroup[group].items.push(itemObject);
      }
      map[itemWithoutGroup.value] = [group, index];
      if (prevGroup != group) {
        groupCount++
        prevGroup = group
      }
      optHeight += eachOptionHeight
    })
    // sum of group padding and divider (1px)
    optHeight += (groupCount * groupDividerHeight) + (groupCount - 1)
    setOptionsHeight(optHeight)
    setValuesMap(map)
    setMappedOptions(arrGroup)
  }, [])

  useEffect(() => {
    if (value && valuesMap[value?.value] != undefined) {
      repositionCenter(value)
    }
  }, [valuesMap])

  const [yScrollOffset, setYScrollOffset] = useState(0)

  interface CenterProp {
    value: string
  }
  const repositionCenter = ({ value }: CenterProp) => {
    const currY = getLayoutY(containerRef.current) - 24
    const { innerHeight } = window

    if (!valuesMap[value]) return

    const [groupIndex, index] = valuesMap[value]
    const topPosition = 24
    const bottomPosition = innerHeight - optionsHeight - 24
    let sidePosition = currY - (groupIndex * groupDividerHeight) - (index * eachOptionHeight)
    let finalPos = sidePosition
    if (window.innerHeight < optionsHeight || sidePosition <= topPosition) {
      finalPos = topPosition
    } else if (bottomPosition < sidePosition) {
      finalPos = bottomPosition
    }
    setYScrollOffset((sidePosition - 24) * -1)
    setSelectY(finalPos + 8)
  }

  const contentPlaceholder = (content: any) => {
    return typeof content === 'object' ? (<>
      {content.icon &&
        <div className='mx-2'>
          {content.icon}
        </div>
      }
      {content.label}
    </>)
      : null;
  }
  const defaultTransitionProps = {
    enter: "transition ease-out duration-100",
    enterFrom: "transform opacity-0 scale-95",
    enterTo: "transform opacity-100 scale-100",
    leave: "transition ease-in duration-75",
    leaveFrom: "transform opacity-100 scale-100",
    leaveTo: "transform opacity-0 scale-90"
  }
  const containerRef = useRef<HTMLDivElement>(null)
  const optionsRef = useRef<HTMLDivElement>(null)
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
    if (value?.label == content.label) {
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
  return (
    <Listbox
      value={value}
      onChange={(value: Item) => { onChange(value) }}
      as="div"
      ref={containerRef}
      className="w-full relative inline-block"
    >
      <Listbox.Button
        style={{ height: eachOptionHeight }}
        className={classNames(
          borderless ? "" : "ring-1 ring-slate-300",
          buttonClass,
          'relative text-sm items-center flex rounded-sm w-full transition-colors ease-in-out duration-200 active:bg-slate-200')}
      >
        {/* value preview */}
        {value && (<>
          {contentPlaceholder(value)}
          {customPostIcon ??
            <div className='absolute right-2'>
              <VscTriangleDown size={12} color="#5f6368" />
            </div>
          }
        </>)}
      </Listbox.Button>
      <Transition
        as={Fragment}
        beforeEnter={() => {
          if (value) repositionCenter(value);
          (optionsRef.current as unknown as { scrollTop: number }).scrollTop = yScrollOffset ?? 0;
        }}
        beforeLeave={() => { setLastActive([-1, -1]) }}
        {...defaultTransitionProps}
      >
        <Listbox.Options
          as='div'
          ref={optionsRef}
          style={{
            width: containerRef.current?.offsetWidth || 240,
            top: selectY,
            overflowY: "auto",
            maxHeight: "calc(100% - 38px)"
          }}
          className="fixed z-30 mt-1 origin-top-center focus:outline-none py-[1px] divide-y origin-center divide-gray-200 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
        >
          {mappedOptions.map(({ items }, groupIndex) => (
            <div className='py-2' key={groupIndex}>
              {items.map((content, i) =>
                <Listbox.Option
                  as={Fragment}
                  key={content.value}
                  value={content}
                >
                  {({ active }) => (
                    <button
                      style={{ height: eachOptionHeight }}
                      onMouseEnter={() => { setLastActive([i, groupIndex]) }}
                      className={"text-left " + getOptionClass({ active, content, index: i, groupIndex })}
                    >
                      {content.icon &&
                        <div className="pl-2 pr-4">
                          {content.icon}
                        </div>
                      }
                      {content.label}
                    </button>
                  )}
                </Listbox.Option>
              )}
            </div>
          ))}
        </Listbox.Options>
      </Transition>
    </Listbox>
  )
}

export default Select