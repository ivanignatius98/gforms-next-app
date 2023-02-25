import { useEffect, useMemo, useState } from 'react';
import Dropdown from '@modules/Dropdown';
import { MdOutlinePalette, MdOutlineSmartDisplay, MdOutlineImage } from 'react-icons/md'
import { VscTriangleDown } from 'react-icons/vsc';
import { getLayoutY } from '@helpers'
interface Item {
  content: string | { icon: JSX.Element, text: string };
}
interface DropdownItem extends Item {
  onClick: () => void;
}

type Props = {
  options: Item[][],
  cardRef: any
};

function Select({ options, cardRef }: Props) {
  const [selectY, setSelectY] = useState(0)
  const [selected, setSelected] = useState<Item>(options[0][0])
  const [mappedOptions, setMappedOptions] = useState<DropdownItem[][]>([])
  useEffect(() => {
    const mappedArr = []
    for (let group of options) {
      const arrGroup: DropdownItem[] = [];
      for (let i = 0; i < group.length; i++) {
        arrGroup.push({
          onClick: () => setSelected(group[i]),
          content: group[i].content
        });
      }
      mappedArr.push(arrGroup)
    }
    setMappedOptions(mappedArr)
  }, [options])
  function contentPlaceholder(content: any) {
    <div className='mx-2'>
      <MdOutlineImage size={24} color="#5f6368" />
    </div>
    return typeof content === 'object' ? (<>
      <div className='mx-2'>
        <MdOutlineImage size={24} color="#5f6368" />
      </div>
      {content.text}
    </>)
      : null;
  }

  return (
    <Dropdown
      containerStyle={{ top: selectY }}
      buttonClassName='w-full relative inline-block'
      containerClassName="fixed z-10 w-60 mt-1 bg-white rounded-md shadow-lg origin-top-center focus:outline-none py-1 divide-y origin-center divide-gray-200 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
      dropdownItemData={mappedOptions}
    >
      <button
        onClick={() => setSelectY(getLayoutY(cardRef))}
        className='relative text-sm items-center flex h-12 ring-1 ring-slate-300 rounded-sm w-full active:bg-slate-200'>
        {/* placeholder */}
        {selected && (<>
          {contentPlaceholder(selected.content)}
          <div className='absolute right-2'>
            <VscTriangleDown size={12} color="#5f6368" />
          </div>
        </>)}
      </button>
    </Dropdown>
  )
}

export default Select